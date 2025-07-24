/**
 * CSRF protection utilities for the contact form
 * Provides token generation, validation, and security measures
 */

import { createHash, randomBytes } from 'crypto'

// CSRF configuration
export const CSRF_CONFIG = {
  TOKEN_LENGTH: 32,
  SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
  MAX_TOKENS_PER_SESSION: 5,
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
}

// In-memory token store (in production, use Redis or database)
interface CSRFToken {
  token: string
  createdAt: number
  used: boolean
}

class CSRFTokenStore {
  private tokens: Map<string, CSRFToken[]> = new Map()
  private lastCleanup: number = Date.now()

  generateToken(sessionId: string): string {
    this.cleanup()

    const token = randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('hex')
    const now = Date.now()

    if (!this.tokens.has(sessionId)) {
      this.tokens.set(sessionId, [])
    }

    const sessionTokens = this.tokens.get(sessionId)!

    // Limit tokens per session
    if (sessionTokens.length >= CSRF_CONFIG.MAX_TOKENS_PER_SESSION) {
      sessionTokens.shift() // Remove oldest token
    }

    sessionTokens.push({
      token,
      createdAt: now,
      used: false,
    })

    return token
  }

  validateToken(
    sessionId: string,
    token: string,
  ): { isValid: boolean; error?: string } {
    this.cleanup()

    if (!this.tokens.has(sessionId)) {
      return { isValid: false, error: 'No tokens found for session' }
    }

    const sessionTokens = this.tokens.get(sessionId)!
    const tokenData = sessionTokens.find((t) => t.token === token)

    if (!tokenData) {
      return { isValid: false, error: 'Invalid token' }
    }

    if (tokenData.used) {
      return { isValid: false, error: 'Token already used' }
    }

    // Mark token as used
    tokenData.used = true

    return { isValid: true }
  }

  private cleanup(): void {
    const now = Date.now()

    // Only cleanup periodically
    if (now - this.lastCleanup < CSRF_CONFIG.CLEANUP_INTERVAL) {
      return
    }

    this.lastCleanup = now
    const cutoff = now - CSRF_CONFIG.SESSION_DURATION

    for (const [sessionId, tokens] of this.tokens.entries()) {
      const validTokens = tokens.filter((t) => t.createdAt > cutoff)

      if (validTokens.length === 0) {
        this.tokens.delete(sessionId)
      } else {
        this.tokens.set(sessionId, validTokens)
      }
    }
  }
}

// Singleton instance
export const csrfTokenStore = new CSRFTokenStore()

/**
 * Generate a CSRF token for a session
 */
export function generateCSRFToken(sessionId: string): string {
  return csrfTokenStore.generateToken(sessionId)
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(
  sessionId: string,
  token: string,
): { isValid: boolean; error?: string } {
  return csrfTokenStore.validateToken(sessionId, token)
}

/**
 * Generate a session ID from request data
 */
export function generateSessionId(req: any): string {
  const ip =
    req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  const userAgent = req.headers['user-agent'] || 'unknown'
  const timestamp = Math.floor(Date.now() / CSRF_CONFIG.SESSION_DURATION)

  const sessionData = `${ip}|${userAgent}|${timestamp}`
  return createHash('sha256').update(sessionData).digest('hex')
}

/**
 * Sanitize input for CSRF protection
 */
export function sanitizeCSRFInput(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '').substring(0, 64)
}
