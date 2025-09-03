/**
 * Email Security Utilities
 * 
 */

import { securityConfig } from './security-config'

// Email validation interface
export interface EmailValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitizedEmail?: string
}

// Email content validation interface
export interface EmailContentValidation {
  isValid: boolean
  errors: string[]
  sanitizedContent?: string
  spamScore: number
}

// Email configuration interface
export interface EmailConfig {
  maxRecipients: number
  maxAttachments: number
  maxAttachmentSize: number
  allowedMimeTypes: string[]
  blockedDomains: string[]
  allowedDomains?: string[]
}

// Default email configuration
const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  maxRecipients: 10,
  maxAttachments: 5,
  maxAttachmentSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'text/plain',
    'text/html',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  blockedDomains: [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
  ],
}

// Email validation patterns
const EMAIL_PATTERNS = {
  // RFC 5322 compliant email regex
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Disposable email patterns
  disposable: /(tempmail|10minutemail|guerrillamail|mailinator|throwaway|temp|fake|spam)/i,
  
  // Suspicious patterns
  suspicious: /(admin|root|test|demo|example|noreply|no-reply|donotreply|do-not-reply)/i,
  
  // Valid domain patterns
  validDomain: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
}

/**
 * Validate email address format and security
 */
export function validateEmail(email: string): EmailValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let sanitizedEmail = email.trim().toLowerCase()
  
  // Basic format validation
  if (!email || typeof email !== 'string') {
    errors.push('Email address is required')
    return { isValid: false, errors, warnings }
  }
  
  // Length validation
  if (sanitizedEmail.length > 254) {
    errors.push('Email address is too long (maximum 254 characters)')
  }
  
  if (sanitizedEmail.length < 5) {
    errors.push('Email address is too short (minimum 5 characters)')
  }
  
  // Format validation
  if (!EMAIL_PATTERNS.email.test(sanitizedEmail)) {
    errors.push('Invalid email address format')
  }
  
  // Domain validation
  const domain = sanitizedEmail.split('@')[1]
  if (domain && !EMAIL_PATTERNS.validDomain.test(domain)) {
    errors.push('Invalid email domain format')
  }
  
  // Disposable email check
  if (EMAIL_PATTERNS.disposable.test(sanitizedEmail)) {
    warnings.push('Email appears to be from a disposable email service')
  }
  
  // Suspicious patterns check
  if (EMAIL_PATTERNS.suspicious.test(sanitizedEmail)) {
    warnings.push('Email contains suspicious patterns')
  }
  
  // Blocked domains check
  const config = securityConfig.getEmailConfig()
  if (config.blockedDomains.some(blocked => sanitizedEmail.includes(blocked))) {
    errors.push('Email domain is not allowed')
  }
  
  // Allowed domains check (if specified)
  if (config.allowedDomains && config.allowedDomains.length > 0) {
    const isAllowed = config.allowedDomains.some(allowed => sanitizedEmail.includes(allowed))
    if (!isAllowed) {
      errors.push('Email domain is not in the allowed list')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedEmail: errors.length === 0 ? sanitizedEmail : undefined,
  }
}

/**
 * Validate email content for security
 */
export function validateEmailContent(content: string): EmailContentValidation {
  const errors: string[] = []
  let sanitizedContent = content
  let spamScore = 0
  
  // Basic validation
  if (!content || typeof content !== 'string') {
    errors.push('Email content is required')
    return { isValid: false, errors, spamScore }
  }
  
  // Length validation
  const maxLength = securityConfig.getValidationConfig().maxMessageLength
  if (content.length > maxLength) {
    errors.push(`Email content is too long (maximum ${maxLength} characters)`)
  }
  
  if (content.length < 10) {
    errors.push('Email content is too short (minimum 10 characters)')
  }
  
  // XSS protection
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
  ]
  
  xssPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push('Email content contains potentially malicious code')
      spamScore += 10
    }
  })
  
  // Spam detection patterns
  const spamPatterns = [
    /(buy\s+now|limited\s+time|act\s+now|click\s+here|free\s+offer)/gi,
    /(viagra|cialis|weight\s+loss|diet\s+pills)/gi,
    /(lottery|winner|prize|claim\s+your)/gi,
    /(urgent|emergency|help\s+needed)/gi,
    /(million|billion|dollars|money)/gi,
  ]
  
  spamPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      spamScore += matches.length * 2
    }
  })
  
  // Excessive punctuation
  const punctuationCount = (content.match(/[!]{2,}|[?]{2,}/g) || []).length
  if (punctuationCount > 3) {
    spamScore += punctuationCount
  }
  
  // Excessive capitalization
  const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length
  if (upperCaseRatio > 0.7) {
    spamScore += 5
  }
  
  // URL count
  const urlCount = (content.match(/https?:\/\/[^\s]+/g) || []).length
  if (urlCount > 3) {
    spamScore += urlCount * 2
  }
  
  // Sanitize content
  sanitizedContent = sanitizeEmailContent(content)
  
  // Final spam score check
  if (spamScore > 20) {
    errors.push('Email content appears to be spam')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedContent,
    spamScore,
  }
}

/**
 * Sanitize email content
 */
export function sanitizeEmailContent(content: string): string {
  let sanitized = content
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:[^"'\s]*/gi, '')
  
  // Remove data: URLs
  sanitized = sanitized.replace(/data:[^"'\s]*/gi, '')
  
  // Remove vbscript: URLs
  sanitized = sanitized.replace(/vbscript:[^"'\s]*/gi, '')
  
  // Remove expression() CSS
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, '')
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim()
  
  return sanitized
}

/**
 * Validate email recipients
 */
export function validateEmailRecipients(recipients: string[]): {
  isValid: boolean
  errors: string[]
  validRecipients: string[]
} {
  const errors: string[] = []
  const validRecipients: string[] = []
  
  if (!Array.isArray(recipients)) {
    errors.push('Recipients must be an array')
    return { isValid: false, errors, validRecipients }
  }
  
  const config = securityConfig.getEmailConfig()
  
  // Check recipient count
  if (recipients.length > config.maxRecipients) {
    errors.push(`Too many recipients (maximum ${config.maxRecipients})`)
  }
  
  if (recipients.length === 0) {
    errors.push('At least one recipient is required')
  }
  
  // Validate each recipient
  recipients.forEach((recipient, index) => {
    const validation = validateEmail(recipient)
    if (!validation.isValid) {
      errors.push(`Recipient ${index + 1}: ${validation.errors.join(', ')}`)
    } else if (validation.sanitizedEmail) {
      validRecipients.push(validation.sanitizedEmail)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    validRecipients,
  }
}

/**
 * Validate email attachments
 */
export function validateEmailAttachments(attachments: Array<{
  filename: string
  contentType: string
  size: number
}>): {
  isValid: boolean
  errors: string[]
  validAttachments: typeof attachments
} {
  const errors: string[] = []
  const validAttachments: typeof attachments = []
  
  if (!Array.isArray(attachments)) {
    errors.push('Attachments must be an array')
    return { isValid: false, errors, validAttachments }
  }
  
  const config = securityConfig.getEmailConfig()
  
  // Check attachment count
  if (attachments.length > config.maxAttachments) {
    errors.push(`Too many attachments (maximum ${config.maxAttachments})`)
  }
  
  // Validate each attachment
  attachments.forEach((attachment, index) => {
    // Check file size
    if (attachment.size > config.maxAttachmentSize) {
      errors.push(`Attachment ${index + 1} is too large (maximum ${config.maxAttachmentSize} bytes)`)
    }
    
    // Check MIME type
    if (!config.allowedMimeTypes.includes(attachment.contentType)) {
      errors.push(`Attachment ${index + 1} has unsupported MIME type: ${attachment.contentType}`)
    }
    
    // Check filename
    if (!attachment.filename || attachment.filename.length > 255) {
      errors.push(`Attachment ${index + 1} has invalid filename`)
    }
    
    // Check for suspicious file extensions
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js']
    const fileExtension = attachment.filename.toLowerCase().split('.').pop()
    if (fileExtension && suspiciousExtensions.includes(`.${fileExtension}`)) {
      errors.push(`Attachment ${index + 1} has suspicious file extension: ${fileExtension}`)
    }
    
    // If all validations pass, add to valid attachments
    if (!errors.some(error => error.includes(`Attachment ${index + 1}`))) {
      validAttachments.push(attachment)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    validAttachments,
  }
}

/**
 * Calculate email spam score
 */
export function calculateEmailSpamScore(email: string, content: string): number {
  let score = 0
  
  // Email-based scoring
  const emailValidation = validateEmail(email)
  if (emailValidation.warnings.length > 0) {
    score += emailValidation.warnings.length * 2
  }
  
  // Content-based scoring
  const contentValidation = validateEmailContent(content)
  score += contentValidation.spamScore
  
  // Additional spam indicators
  const spamIndicators = [
    /(buy\s+now|limited\s+time|act\s+now)/gi,
    /(free\s+offer|no\s+cost|zero\s+cost)/gi,
    /(guaranteed|promise|assurance)/gi,
    /(click\s+here|visit\s+now|go\s+to)/gi,
    /(urgent|emergency|immediate)/gi,
  ]
  
  spamIndicators.forEach(indicator => {
    const matches = content.match(indicator)
    if (matches) {
      score += matches.length
    }
  })
  
  return Math.min(score, 100) // Cap at 100
}

/**
 * Check if email is likely spam
 */
export function isEmailSpam(email: string, content: string): boolean {
  const spamScore = calculateEmailSpamScore(email, content)
  return spamScore > 15 // Threshold for spam detection
}

/**
 * Get email security recommendations
 */
export function getEmailSecurityRecommendations(email: string, content: string): string[] {
  const recommendations: string[] = []
  
  const emailValidation = validateEmail(email)
  const contentValidation = validateEmailContent(content)
  const spamScore = calculateEmailSpamScore(email, content)
  
  if (emailValidation.warnings.length > 0) {
    recommendations.push('Consider using a non-disposable email address')
  }
  
  if (contentValidation.spamScore > 10) {
    recommendations.push('Email content contains spam indicators')
  }
  
  if (spamScore > 20) {
    recommendations.push('Email has high spam score - review content')
  }
  
  if (contentValidation.errors.length > 0) {
    recommendations.push('Email content contains security issues')
  }
  
  return recommendations
}

// Export utility functions
export {
  DEFAULT_EMAIL_CONFIG,
} 