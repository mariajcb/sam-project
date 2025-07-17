import { sanitizeInput,SECURITY_CONFIG, validateEmail } from './security'

export interface ContactSubmissionData {
  name: string
  email: string
  subject: string
  message: string
  honeypot?: string
  ipAddress?: string
  userAgent?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  sanitizedData?: ContactSubmissionData
}

export function validateContactSubmission(data: any): ValidationResult {
  const errors: Record<string, string> = {}
  const sanitizedData: Partial<ContactSubmissionData> = {}  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.name = 'Name is required'
  } else {
    const sanitizedName = sanitizeInput(data.name, SECURITY_CONFIG.MAX_NAME_LENGTH)
    if (sanitizedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long'
    } else if (sanitizedName.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
      errors.name = `Name must be no more than ${SECURITY_CONFIG.MAX_NAME_LENGTH} characters`
    } else {
      if (/[<>"'&]/.test(sanitizedName)) {
        errors.name = 'Name contains invalid characters'
      } else {
        sanitizedData.name = sanitizedName
      }
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
      if (/[<>"'&]/.test(sanitizedSubject)) {
        errors.subject = 'Subject contains invalid characters'
      } else {
        sanitizedData.subject = sanitizedSubject
      }
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
      if (/[<>"'&]/.test(sanitizedMessage)) {
        errors.message = 'Message contains invalid characters'
      } else {
        sanitizedData.message = sanitizedMessage
      }
    }
  }

  // Validate honeypot (should be empty)
  if (data.honeypot && data.honeypot.trim() !== '') {
    errors.honeypot = 'Spam detected'
  }

  // Validate IP address (optional)
  if (data.ipAddress && typeof data.ipAddress === 'string') {
    const sanitizedIp = sanitizeInput(data.ipAddress, 45)
    if (sanitizedIp.length > 0) {
      sanitizedData.ipAddress = sanitizedIp
    }
  }

  // Validate user agent (optional)
  if (data.userAgent && typeof data.userAgent === 'string') {
    const sanitizedUserAgent = sanitizeInput(data.userAgent, 500)
    if (sanitizedUserAgent.length > 0) {
      sanitizedData.userAgent = sanitizedUserAgent
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: Object.keys(errors).length === 0 ? sanitizedData as ContactSubmissionData : undefined,
  }
}

export function validateWebhookPayload(payload: any): { isValid: boolean; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Invalid payload format' }
  }

  if (!payload._type || payload._type !== 'contactSubmission') {
    return { isValid: false, error: 'Invalid document type' }
  }

  if (!payload._id || typeof payload._id !== 'string') {
    return { isValid: false, error: 'Missing document ID' }
  }

  // Validate required fields
  const requiredFields = ['name', 'email', 'subject', 'message']
  for (const field of requiredFields) {
    if (!payload[field] || typeof payload[field] !== 'string') {
      return { isValid: false, error: `Missing required field: ${field}` }
    }
  }

  return { isValid: true }
}

export function validateContactFormEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const requiredVars = [
    'SANITY_API_WRITE_TOKEN',
    'SANITY_CONTACT_WEBHOOK_SECRET',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
  ]

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  })

  // Validate token lengths
  if (process.env.SANITY_API_WRITE_TOKEN && process.env.SANITY_API_WRITE_TOKEN.length < 20) {
    errors.push('SANITY_API_WRITE_TOKEN appears to be invalid (too short)')
  }

  if (process.env.SANITY_CONTACT_WEBHOOK_SECRET && process.env.SANITY_CONTACT_WEBHOOK_SECRET.length < 16) {
    errors.push('SANITY_CONTACT_WEBHOOK_SECRET appears to be invalid (too short)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function calculateSpamScore(data: ContactSubmissionData): number {
  let score = 0
  // Check for suspicious patterns in name
  if (data.name && /[0-9,]/.test(data.name)) {
    score += 20 // Multiple numbers in name
  }

  // Check for suspicious patterns in subject
  if (data.subject) {
    const subject = data.subject.toLowerCase()
    if (subject.includes('viagra') || subject.includes('casino') || subject.includes('loan')) {
      score += 30 // Spam keywords
    }
    if (subject.includes('$$') || subject.includes('make money')) {
      score += 25 // Money-related spam
    }
  }

  // Check for suspicious patterns in message
  if (data.message) {
    const message = data.message.toLowerCase()
    if (message.includes('click here') || message.includes('buy now')) {
      score += 20 // Marketing spam
    }
    if (message.includes('http://') || message.includes('https://')) {
      score += 15 // Links in message
    }
  }

  // Check for disposable email (basic check)
  if (data.email) {
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com']
    const domain = data.email.split('@')[1].toLowerCase()
    if (domain && disposableDomains.includes(domain)) {
      score += 40 // Disposable email
    }
  }

  return Math.min(score, 100) // Cap at 100
}

export function isSpam(data: ContactSubmissionData): boolean {
  const spamScore = calculateSpamScore(data)
  return spamScore >= 50 // Threshold for spam detection
} 