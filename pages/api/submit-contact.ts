/**
 * This code is responsible for processing contact form submissions:
 * Receives form data
 * Validates input
 * Creates contactSubmission document in Sanity
 * Sends email notification via Resend
 * Returns success to user
 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { createSecureDocument } from '../../lib/sanity.client'
import { handleSecurityError } from '../../lib/security'
import { validateContactSubmission } from '../../lib/validation'
import { sanitizeInput, SECURITY_CONFIG, generateSubmissionHash } from '../../lib/security'
import { calculateSpamScore, isSpam } from '../../lib/validation'
import { sendContactFormNotification } from '../../lib/email.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    // Validate the submission data
    const validation = validateContactSubmission(req.body)
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      })
    }

    const { sanitizedData } = validation

    // Prepare submission data
    const submissionData = {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      submittedAt: new Date().toISOString(),
      status: 'new',
      // Add security metadata
      submissionHash: generateSubmissionHash(
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
        },
        req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress || 'unknown',
      ),
      spamScore: calculateSpamScore({
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
      }),
      securityFlags: [],
      ipAddress: req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || '',
    }

    // Check for spam
    if (isSpam(submissionData)) {
      submissionData.status = 'spam'
      submissionData.securityFlags.push('suspicious_content')
    }

    // Create the contact submission document in Sanity
    const result = await createSecureDocument(
      submissionData,
      'contactSubmission',
    )

    // Send email notification immediately (only for non-spam submissions)
    if (submissionData.status !== 'spam') {
      try {
        await sendContactFormNotification(result)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: result._id,
    })
  } catch (error) {
    const securityError = handleSecurityError(error, 'submit-contact')
    
    res.status(500).json({
      error: 'Failed to submit contact form',
      message: securityError.message,
    })
  }
}
