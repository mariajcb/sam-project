/**
 * Security utilities for the Sanity webhook implementation
 * Provides input sanitization, validation, and security-focused error handling
 */

import { createHash } from 'crypto'

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
  
  // Input validation
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_SUBJECT_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 5000,
  
  // Content filtering
  ALLOWED_HTML_TAGS: ['p', 'br', 'strong', 'em', 'u'],
  BLOCKED_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
  ],
  
  // Timing validation
  MIN_SUBMISSION_TIME: 2000, // 2 seconds minimum
  MAX_SUBMISSION_TIME: 300000, // 5 minutes maximum
}

/**
 * Sanitize and validate input strings
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Trim whitespace
  let sanitized = input.trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Normalize line endings
  sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  return sanitized
}

/**
 * Validate email address format and security
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }
  
  const sanitizedEmail = sanitizeInput(email, SECURITY_CONFIG.MAX_EMAIL_LENGTH)
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  // Check for suspicious patterns
  if (sanitizedEmail.includes('..') || sanitizedEmail.includes('--')) {
    return { isValid: false, error: 'Suspicious email pattern detected' }
  }
  
  // Check for disposable email domains (basic check)
  const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com']
  const domain = sanitizedEmail.split('@')[1]?.toLowerCase()
  if (domain && disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Disposable email addresses are not allowed' }
  }
  
  return { isValid: true }
}

/**
 * Validate and sanitize form data
 */
export function validateFormData(data: any): { isValid: boolean; errors: Record<string, string>; sanitizedData?: any } {
  const errors: Record<string, string> = {}
  const sanitizedData: any = {}
  
  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.name = 'Name is required'
  } else {
    const sanitizedName = sanitizeInput(data.name, SECURITY_CONFIG.MAX_NAME_LENGTH)
    if (sanitizedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long'
    } else if (sanitizedName.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
      errors.name = `Name must be no more than ${SECURITY_CONFIG.MAX_NAME_LENGTH} characters`
    } else {
      sanitizedData.name = sanitizedName
    }
  }
  
  // Validate email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error || 'Invalid email'
  } else {
    sanitizedData.email = sanitizeInput(data.email, SECURITY_CONFIG.MAX_EMAIL_LENGTH)
  }
  
  // Validate subject
  if (!data.subject || typeof data.subject !== 'string') {
    errors.subject = 'Subject is required'
  } else {
    const sanitizedSubject = sanitizeInput(data.subject, SECURITY_CONFIG.MAX_SUBJECT_LENGTH)
    if (sanitizedSubject.length < 3) {
      errors.subject = 'Subject must be at least 3 characters long'
    } else if (sanitizedSubject.length > SECURITY_CONFIG.MAX_SUBJECT_LENGTH) {
      errors.subject = `Subject must be no more than ${SECURITY_CONFIG.MAX_SUBJECT_LENGTH} characters`
    } else {
      sanitizedData.subject = sanitizedSubject
    }
  }
  
  // Validate message
  if (!data.message || typeof data.message !== 'string') {
    errors.message = 'Message is required'
  } else {
    const sanitizedMessage = sanitizeInput(data.message, SECURITY_CONFIG.MAX_MESSAGE_LENGTH)
    if (sanitizedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters long'
    } else if (sanitizedMessage.length > SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
      errors.message = `Message must be no more than ${SECURITY_CONFIG.MAX_MESSAGE_LENGTH} characters`
    } else {
      sanitizedData.message = sanitizedMessage
    }
  }
  
  // Validate honeypot (should be empty)
  if (data.honeypot && data.honeypot.trim() !== '') {
    errors.honeypot = 'Spam detected'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: Object.keys(errors).length === 0 ? sanitizedData : undefined
  }
}

/**
 * Generate a secure hash for duplicate detection
 */
export function generateSubmissionHash(data: any, ipAddress: string): string {
  const content = `${data.name}|${data.email}|${data.subject}|${data.message}|${ipAddress}`
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Check if submission timing is suspicious
 */
export function validateSubmissionTiming(startTime: number): { isValid: boolean; error?: string } {
  const elapsed = Date.now() - startTime
  
  if (elapsed < SECURITY_CONFIG.MIN_SUBMISSION_TIME) {
    return { isValid: false, error: 'Submission too fast - possible bot' }
  }
  
  if (elapsed > SECURITY_CONFIG.MAX_SUBMISSION_TIME) {
    return { isValid: false, error: 'Submission too slow - session expired' }
  }
  
  return { isValid: true }
}

/**
 * Sanitize HTML content while allowing safe tags
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }
  
  let sanitized = html
  
  // Remove blocked patterns
  SECURITY_CONFIG.BLOCKED_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })
  
  // Only allow specific HTML tags
  const allowedTags = SECURITY_CONFIG.ALLOWED_HTML_TAGS.join('|')
  const tagRegex = new RegExp(`<(?!\/?(?:${allowedTags})\b)[^>]+>`, 'gi')
  sanitized = sanitized.replace(tagRegex, '')
  
  return sanitized
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validate environment variables for security
 */
export function validateEnvironmentVariables(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const requiredVars = [
    'SANITY_API_WRITE_TOKEN',
    'SANITY_CONTACT_WEBHOOK_SECRET',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET'
  ]
  

  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  })
  
  // Validate token format (basic check)
  if (process.env.SANITY_API_WRITE_TOKEN && process.env.SANITY_API_WRITE_TOKEN.length < 20) {
    errors.push('SANITY_API_WRITE_TOKEN appears to be invalid (too short)')
  }
  
  if (process.env.SANITY_CONTACT_WEBHOOK_SECRET && process.env.SANITY_CONTACT_WEBHOOK_SECRET.length < 16) {
    errors.push('SANITY_CONTACT_WEBHOOK_SECRET appears to be invalid (too short)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Security-focused error handler
 */
export function handleSecurityError(error: any, context: string): { message: string; logLevel: 'info' | 'warn' | 'error' } {
  // Don't expose sensitive information in error messages
  const genericMessage = 'An error occurred while processing your request'
  
  // Log the actual error for debugging (but don't expose to user)
  console.error(`Security error in ${context}:`, error)
  
  // Determine log level based on error type
  let logLevel: 'info' | 'warn' | 'error' = 'error'
  
  if (error.message?.includes('validation') || error.message?.includes('rate limit')) {
    logLevel = 'warn'
  } else if (error.message?.includes('spam') || error.message?.includes('suspicious')) {
    logLevel = 'info'
  }
  
  return {
    message: genericMessage,
    logLevel
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  isAllowed(identifier: string, maxRequests: number = SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE): boolean {
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [now])
      return true
    }
    
    const requests = this.requests.get(identifier)!
    const validRequests = requests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }
  
  getRemainingRequests(identifier: string, maxRequests: number = SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE): number {
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    
    if (!this.requests.has(identifier)) {
      return maxRequests
    }
    
    const requests = this.requests.get(identifier)!
    const validRequests = requests.filter(time => now - time < windowMs)
    
    return Math.max(0, maxRequests - validRequests.length)
  }
}

// Export a singleton instance
export const rateLimiter = new RateLimiter() 