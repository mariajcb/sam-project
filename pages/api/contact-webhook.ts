import type { NextApiRequest, NextApiResponse } from 'next'

import { sendContactFormNotification } from '../../lib/email.service'
import { RateLimiter } from '../../lib/rate-limiter'
import { getWriteClient } from '../../lib/sanity.client'
import { handleSecurityError } from '../../lib/security'
import { validateWebhookPayload } from '../../lib/validation'
import {
  extractWebhookData,
  getClientIP,
  WEBHOOK_SECURITY_CONFIG,
} from '../../lib/webhook-security'

// In-memory rate limiters (per process)
const ipRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 10 }) // 10 req/min per IP
const webhookRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 100 }) // 100 req/min per endpoint

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // Rate limit by IP
  const ip = getClientIP(req)
  if (!ipRateLimiter.isAllowed(ip)) {
    console.warn('[Webhook Security] Rate limit exceeded for IP:', ip)
    return res.status(429).json({ error: 'Too many requests (IP rate limit)' })
  }
  if (!webhookRateLimiter.isAllowed('contact-webhook')) {
    console.warn('[Webhook Security] Rate limit exceeded for webhook endpoint')
    return res
      .status(429)
      .json({ error: 'Too many requests (webhook rate limit)' })
  }

  // Validate webhook security (signature, timestamp, headers, size)
  const { isValid, error, data } = extractWebhookData(req)
  if (!isValid) {
    // Log security event
    console.warn('[Webhook Security] Invalid request:', { ip, error })
    return res.status(400).json({ error: 'Invalid webhook: ' + error })
  }

  try {
    // Validate webhook payload
    const payloadValidation = validateWebhookPayload(data?.body)
    if (!payloadValidation.isValid) {
      console.warn('[Webhook Security] Invalid payload:', {
        ip,
        error: payloadValidation.error,
      })
      return res
        .status(400)
        .json({ error: 'Invalid payload: ' + payloadValidation.error })
    }

    const submission = data?.body

    // Process the contact submission
    await processContactSubmission(submission, ip)

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact submission processed successfully',
      submissionId: submission._id,
    })
  } catch (error) {
    const securityError = handleSecurityError(error, 'contact-webhook')
    console.error(
      '[Webhook Error] Failed to process contact submission:',
      error,
    )

    res.status(500).json({
      error: 'Failed to process contact submission',
      message: securityError.message,
    })
  }
}

/**
 * Process a contact submission from the webhook
 */
async function processContactSubmission(submission: any, ip: string) {
  const writeClient = getWriteClient()
  const now = new Date().toISOString()

  try {
    // Update the document with processing metadata
    const updateData: any = {
      processedAt: now,
      // Add security tracking
      _security: {
        processedVia: 'webhook',
        processedAt: now,
        processorIP: ip,
        version: '1.0',
      },
    }

    // Check if email should be sent (only for non-spam submissions)
    if (submission.status !== 'spam') {
      try {
        const emailResult = await sendContactFormNotification(submission)
        if (emailResult.success) {
          updateData.emailSentAt = now
          updateData.status = 'read'
        } else {
          console.error(
            '[Email Error] Failed to send email notification:',
            emailResult.error,
          )
          updateData.status = 'new' // Keep as new if email fails
        }
      } catch (emailError) {
        console.error(
          '[Email Error] Failed to send email notification:',
          emailError,
        )
        updateData.status = 'new' // Keep as new if email fails
      }
    }

    // Update the document in Sanity
    await writeClient.patch(submission._id).set(updateData).commit()

    console.log('[Webhook Success] Processed contact submission:', {
      id: submission._id,
      status: updateData.status,
      emailSent: !!updateData.emailSentAt,
    })
  } catch (error) {
    console.error('[Webhook Error] Failed to update submission:', error)
    throw error
  }
}
