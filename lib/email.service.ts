/**
 * Secure email service for contact form notifications
 * Provides email sending with validation, rate limiting, and security measures
 */

import { sanitizeInput, SECURITY_CONFIG } from './security'

export interface EmailData {
  to: string
  from: string
  subject: string
  message: string
  name: string
  email: string
  submissionId: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface EmailConfig {
  fromEmail: string
  toEmail: string
  subjectPrefix: string
  rateLimitPerHour: number
}

// Default email configuration
export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  fromEmail: process.env.CONTACT_FROM_EMAIL || 'noreply@yourdomain.com',
  toEmail: process.env.CONTACT_TO_EMAIL || 'contact@yourdomain.com',
  subjectPrefix: '[Contact Form]',
  rateLimitPerHour: 100,
}

// In-memory rate limiter for email sending
class EmailRateLimiter {
  private emails: Map<string, number[]> = new Map()

  isAllowed(recipient: string, maxPerHour: number): boolean {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    if (!this.emails.has(recipient)) {
      this.emails.set(recipient, [now])
      return true
    }

    const timestamps = this.emails.get(recipient)!
    const recentEmails = timestamps.filter((time) => now - time < oneHour)

    if (recentEmails.length >= maxPerHour) {
      return false
    }

    recentEmails.push(now)
    this.emails.set(recipient, recentEmails)
    return true
  }
}

const emailRateLimiter = new EmailRateLimiter()

/**
 * Validate email data for security
 */
export function validateEmailData(data: EmailData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.to)) {
    errors.push('Invalid recipient email address')
  }
  if (!emailRegex.test(data.from)) {
    errors.push('Invalid sender email address')
  }
  if (!emailRegex.test(data.email)) {
    errors.push('Invalid contact email address')
  }

  // Validate content length
  if (data.subject.length > 200) {
    errors.push('Subject too long')
  }
  if (data.message.length > 5000) {
    errors.push('Message too long')
  }
  if (data.name.length > 100) {
    errors.push('Name too long')
  }

  // Check for suspicious content
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
  ]

  const content = `${data.subject} ${data.message} ${data.name}`.toLowerCase()
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      errors.push('Suspicious content detected')
      break
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize email content
 */
export function sanitizeEmailContent(data: EmailData): EmailData {
  return {
    ...data,
    subject: sanitizeInput(data.subject, 200),
    message: sanitizeInput(data.message, 5000),
    name: sanitizeInput(data.name, 100),
    email: sanitizeInput(data.email, 254),
  }
}

/**
 * Generate email HTML content
 */
export function generateEmailHTML(data: EmailData): string {
  const sanitizedData = sanitizeEmailContent(data)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #495057;">Contact Information</h3>
          <p><strong>Name:</strong> ${sanitizedData.name}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #495057;">Message</h3>
          <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
          <p><strong>Submission ID:</strong> ${sanitizedData.submissionId}</p>
          <p><strong>Received:</strong> ${new Date().toISOString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate email text content
 */
export function generateEmailText(data: EmailData): string {
  const sanitizedData = sanitizeEmailContent(data)

  return `
New Contact Form Submission

Contact Information:
- Name: ${sanitizedData.name}
- Email: ${sanitizedData.email}
- Subject: ${sanitizedData.subject}

Message:
${sanitizedData.message}

---
Submission ID: ${sanitizedData.submissionId}
Received: ${new Date().toISOString()}
  `.trim()
}

/**
 * Send email notification (placeholder implementation)
 * Replace this with your preferred email service (SendGrid, AWS SES, etc.)
 */
export async function sendEmailNotification(
  data: EmailData,
  config: EmailConfig = DEFAULT_EMAIL_CONFIG,
): Promise<EmailResult> {
  try {
    // Rate limiting
    if (!emailRateLimiter.isAllowed(config.toEmail, config.rateLimitPerHour)) {
      return {
        success: false,
        error: 'Email rate limit exceeded',
      }
    }

    // Validate email data
    const validation = validateEmailData(data)
    if (!validation.isValid) {
      return {
        success: false,
        error: `Email validation failed: ${validation.errors.join(', ')}`,
      }
    }

    // Prepare email content
    const emailData = {
      to: config.toEmail,
      from: config.fromEmail,
      subject: `${config.subjectPrefix} ${data.subject}`,
      message: data.message,
      name: data.name,
      email: data.email,
      submissionId: data.submissionId,
    }

    // Generate email content
    const htmlContent = generateEmailHTML(emailData)
    const textContent = generateEmailText(emailData)

    // TODO: Replace with actual email service implementation
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // const msg = {
    //   to: emailData.to,
    //   from: emailData.from,
    //   subject: emailData.subject,
    //   text: textContent,
    //   html: htmlContent,
    // }
    // await sgMail.send(msg)

    // For now, just log the email (replace with actual implementation)
    console.log('[Email Service] Would send email:', {
      to: emailData.to,
      subject: emailData.subject,
      submissionId: emailData.submissionId,
      htmlLength: htmlContent.length,
      textLength: textContent.length,
    })

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      success: true,
      messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send contact form notification
 */
export async function sendContactFormNotification(
  submission: any,
  config: EmailConfig = DEFAULT_EMAIL_CONFIG,
): Promise<EmailResult> {
  const emailData: EmailData = {
    to: config.toEmail,
    from: config.fromEmail,
    subject: submission.subject || 'New Contact Form Submission',
    message: submission.message || '',
    name: submission.name || 'Anonymous',
    email: submission.email || 'no-email@example.com',
    submissionId: submission._id || 'unknown',
  }

  return sendEmailNotification(emailData, config)
}
