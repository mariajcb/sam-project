import { useEffect, useRef,useState } from 'react'

import { createSecureDocument } from '../lib/sanity.client'
import { sanitizeInput, SECURITY_CONFIG } from '../lib/security'
import { generateSubmissionHash } from '../lib/security'
import {
  calculateSpamScore,
  isSpam,
  validateContactSubmission,
} from '../lib/validation'
import Button from './Button'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  honeypot: string // Hidden field for spam detection
  csrfToken: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  honeypot?: string
  csrfToken?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
    csrfToken: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const formStartTime = useRef<number>(Date.now())

  // Generate CSRF token on component mount
  useEffect(() => {
    const generateToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'same-origin',
        })
        if (response.ok) {
          const data = await response.json()
          setCsrfToken(data.token)
          setFormData((prev) => ({ ...prev, csrfToken: data.token }))
        }
      } catch (error) {
        console.error('Failed to generate CSRF token:', error)
      }
    }
    generateToken()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else {
      const sanitizedName = sanitizeInput(
        formData.name,
        SECURITY_CONFIG.MAX_NAME_LENGTH,
      )
      if (sanitizedName.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long'
      } else if (sanitizedName.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
        newErrors.name = `Name must be no more than ${SECURITY_CONFIG.MAX_NAME_LENGTH} characters`
      } else if (/[<>"'&]/.test(sanitizedName)) {
        newErrors.name = 'Name contains invalid characters'
      }
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      } else {
        const sanitizedEmail = sanitizeInput(
          formData.email,
          SECURITY_CONFIG.MAX_EMAIL_LENGTH,
        )
        if (sanitizedEmail.length > SECURITY_CONFIG.MAX_EMAIL_LENGTH) {
          newErrors.email = `Email must be no more than ${SECURITY_CONFIG.MAX_EMAIL_LENGTH} characters`
        }
      }
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else {
      const sanitizedSubject = sanitizeInput(
        formData.subject,
        SECURITY_CONFIG.MAX_SUBJECT_LENGTH,
      )
      if (sanitizedSubject.length < 3) {
        newErrors.subject = 'Subject must be at least 3 characters long'
      } else if (sanitizedSubject.length > SECURITY_CONFIG.MAX_SUBJECT_LENGTH) {
        newErrors.subject = `Subject must be no more than ${SECURITY_CONFIG.MAX_SUBJECT_LENGTH} characters`
      } else if (/[<>"'&]/.test(sanitizedSubject)) {
        newErrors.subject = 'Subject contains invalid characters'
      }
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else {
      const sanitizedMessage = sanitizeInput(
        formData.message,
        SECURITY_CONFIG.MAX_MESSAGE_LENGTH,
      )
      if (sanitizedMessage.length < 10) {
        newErrors.message = 'Message must be at least 10 characters long'
      } else if (sanitizedMessage.length > SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
        newErrors.message = `Message must be no more than ${SECURITY_CONFIG.MAX_MESSAGE_LENGTH} characters`
      } else if (/[<>"'&]/.test(sanitizedMessage)) {
        newErrors.message = 'Message contains invalid characters'
      }
    }

    // Validate honeypot (should be empty)
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      newErrors.honeypot = 'Spam detected'
    }

    // Validate CSRF token
    if (!formData.csrfToken) {
      newErrors.csrfToken = 'Security token is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Check submission timing
    const elapsed = Date.now() - formStartTime.current
    if (elapsed < SECURITY_CONFIG.MIN_SUBMISSION_TIME) {
      setSubmitStatus('error')
      setSubmitMessage('Please take your time filling out the form.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Prepare submission data
      const submissionData = {
        name: sanitizeInput(formData.name, SECURITY_CONFIG.MAX_NAME_LENGTH),
        email: sanitizeInput(formData.email, SECURITY_CONFIG.MAX_EMAIL_LENGTH),
        subject: sanitizeInput(
          formData.subject,
          SECURITY_CONFIG.MAX_SUBJECT_LENGTH,
        ),
        message: sanitizeInput(
          formData.message,
          SECURITY_CONFIG.MAX_MESSAGE_LENGTH,
        ),
        submittedAt: new Date().toISOString(),
        status: 'new',
        honeypot: formData.honeypot,
        csrfToken: formData.csrfToken,
        // Add security metadata
        submissionHash: generateSubmissionHash(
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
          'client',
        ),
        spamScore: calculateSpamScore({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
        securityFlags: [],
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

      setSubmitStatus('success')
      setSubmitMessage(
        "Thank you for your message! We'll get back to you soon.",
      )
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: '',
        csrfToken: csrfToken, // Keep the same token for potential resubmission
      })
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
      setSubmitMessage('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div>
            <label htmlFor="name" className="form-label">
              Name <span className="form-required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'form-input-error-state' : 'form-input'}
              placeholder="Your name"
              maxLength={SECURITY_CONFIG.MAX_NAME_LENGTH}
              autoComplete="name"
            />
            {errors.name && <p className="form-error-message">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email <span className="form-required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'form-input-error-state' : 'form-input'}
              placeholder="your.email@example.com"
              maxLength={SECURITY_CONFIG.MAX_EMAIL_LENGTH}
              autoComplete="email"
            />
            {errors.email && (
              <p className="form-error-message">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="form-label">
            Subject <span className="form-required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={errors.subject ? 'form-input-error-state' : 'form-input'}
            placeholder="What's this about?"
            maxLength={SECURITY_CONFIG.MAX_SUBJECT_LENGTH}
            autoComplete="off"
          />
          {errors.subject && (
            <p className="form-error-message">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            Message <span className="form-required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={errors.message ? 'form-textarea-error' : 'form-textarea'}
            placeholder="Tell me more..."
            maxLength={SECURITY_CONFIG.MAX_MESSAGE_LENGTH}
          />
          {errors.message && (
            <p className="form-error-message">{errors.message}</p>
          )}
        </div>

        {/* Honeypot field - hidden from users */}
        <div style={{ display: 'none' }}>
          <label htmlFor="honeypot" className="form-label">
            Leave this empty
          </label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Hidden CSRF token */}
        <input type="hidden" name="csrfToken" value={formData.csrfToken} />

        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{submitMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={isSubmitting || !csrfToken}
          loading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  )
}
