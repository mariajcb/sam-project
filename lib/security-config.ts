/**
 * Security Configuration Management
 * 
 * This file centralizes all security-related configuration and provides
 * utilities for managing security settings across the application.
 */

import { SECURITY_CONFIG } from './security'

// Security configuration interface
export interface SecurityConfig {
  // Rate limiting configuration
  rateLimiting: {
    requestsPerMinute: number
    requestsPerHour: number
    burstLimit: number
    windowMs: number
  }
  
  // Input validation configuration
  validation: {
    maxNameLength: number
    maxEmailLength: number
    maxSubjectLength: number
    maxMessageLength: number
    minSubmissionTime: number
    maxSubmissionTime: number
  }
  
  // Content filtering configuration
  contentFiltering: {
    blockedPatterns: RegExp[]
    allowedCharacters: RegExp
    maxConsecutiveChars: number
  }
  
  // Webhook security configuration
  webhook: {
    maxPayloadSize: number
    signatureTimeout: number
    replayProtectionWindow: number
  }
  
  // Email security configuration
  email: {
    maxRecipients: number
    maxAttachments: number
    maxAttachmentSize: number
    allowedMimeTypes: string[]
    blockedDomains: string[]
    allowedDomains?: string[]
  }
  
  // Admin security configuration
  admin: {
    sessionTimeout: number
    maxLoginAttempts: number
    lockoutDuration: number
    requireMFA: boolean
  }
  
  // Monitoring configuration
  monitoring: {
    logSecurityEvents: boolean
    alertOnSuspiciousActivity: boolean
    retentionDays: number
  }
}

// Default security configuration
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  rateLimiting: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    burstLimit: 10,
    windowMs: 60000,
  },
  
  validation: {
    maxNameLength: SECURITY_CONFIG.MAX_NAME_LENGTH,
    maxEmailLength: SECURITY_CONFIG.MAX_EMAIL_LENGTH,
    maxSubjectLength: SECURITY_CONFIG.MAX_SUBJECT_LENGTH,
    maxMessageLength: SECURITY_CONFIG.MAX_MESSAGE_LENGTH,
    minSubmissionTime: SECURITY_CONFIG.MIN_SUBMISSION_TIME,
    maxSubmissionTime: 300000, // 5 minutes
  },
  
  contentFiltering: {
    blockedPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
    ],
    allowedCharacters: /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+=<>[\]{}|\\\/"':;~`]+$/,
    maxConsecutiveChars: 5,
  },
  
  webhook: {
    maxPayloadSize: 1024 * 1024, // 1MB
    signatureTimeout: 300000, // 5 minutes
    replayProtectionWindow: 600000, // 10 minutes
  },
  
  email: {
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
    allowedDomains: undefined,
  },
  
  admin: {
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    requireMFA: false,
  },
  
  monitoring: {
    logSecurityEvents: true,
    alertOnSuspiciousActivity: true,
    retentionDays: 90,
  },
}

// Environment-specific security configuration
export function getSecurityConfig(): SecurityConfig {
  const env = process.env.NODE_ENV || 'development'
  
  const baseConfig = { ...DEFAULT_SECURITY_CONFIG }
  
  // Production-specific overrides
  if (env === 'production') {
    baseConfig.rateLimiting.requestsPerMinute = 30
    baseConfig.rateLimiting.requestsPerHour = 500
    baseConfig.admin.requireMFA = true
    baseConfig.monitoring.logSecurityEvents = true
    baseConfig.monitoring.alertOnSuspiciousActivity = true
  }
  
  // Development-specific overrides
  if (env === 'development') {
    baseConfig.rateLimiting.requestsPerMinute = 1000
    baseConfig.rateLimiting.requestsPerHour = 10000
    baseConfig.monitoring.logSecurityEvents = false
    baseConfig.monitoring.alertOnSuspiciousActivity = false
  }
  
  return baseConfig
}

// Security configuration validation
export function validateSecurityConfig(config: SecurityConfig): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Validate rate limiting
  if (config.rateLimiting.requestsPerMinute <= 0) {
    errors.push('Rate limiting requests per minute must be positive')
  }
  
  if (config.rateLimiting.requestsPerHour <= 0) {
    errors.push('Rate limiting requests per hour must be positive')
  }
  
  // Validate validation settings
  if (config.validation.maxNameLength <= 0) {
    errors.push('Maximum name length must be positive')
  }
  
  if (config.validation.maxEmailLength <= 0) {
    errors.push('Maximum email length must be positive')
  }
  
  if (config.validation.maxSubjectLength <= 0) {
    errors.push('Maximum subject length must be positive')
  }
  
  if (config.validation.maxMessageLength <= 0) {
    errors.push('Maximum message length must be positive')
  }
  
  // Validate webhook settings
  if (config.webhook.maxPayloadSize <= 0) {
    errors.push('Maximum payload size must be positive')
  }
  
  if (config.webhook.signatureTimeout <= 0) {
    errors.push('Signature timeout must be positive')
  }
  
  // Validate email settings
  if (config.email.maxRecipients <= 0) {
    errors.push('Maximum recipients must be positive')
  }
  
  if (config.email.maxAttachments <= 0) {
    errors.push('Maximum attachments must be positive')
  }
  
  if (config.email.maxAttachmentSize <= 0) {
    errors.push('Maximum attachment size must be positive')
  }
  
  // Validate admin settings
  if (config.admin.sessionTimeout <= 0) {
    errors.push('Session timeout must be positive')
  }
  
  if (config.admin.maxLoginAttempts <= 0) {
    errors.push('Maximum login attempts must be positive')
  }
  
  if (config.admin.lockoutDuration <= 0) {
    errors.push('Lockout duration must be positive')
  }
  
  // Validate monitoring settings
  if (config.monitoring.retentionDays <= 0) {
    errors.push('Retention days must be positive')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Security configuration utilities
export class SecurityConfigManager {
  private config: SecurityConfig
  
  constructor(config?: SecurityConfig) {
    this.config = config || getSecurityConfig()
    
    // Validate configuration on initialization
    const validation = validateSecurityConfig(this.config)
    if (!validation.isValid) {
      throw new Error(`Invalid security configuration: ${validation.errors.join(', ')}`)
    }
  }
  
  getConfig(): SecurityConfig {
    return { ...this.config }
  }
  
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates }
    
    // Validate updated configuration
    const validation = validateSecurityConfig(this.config)
    if (!validation.isValid) {
      throw new Error(`Invalid security configuration update: ${validation.errors.join(', ')}`)
    }
  }
  
  getRateLimitingConfig() {
    return this.config.rateLimiting
  }
  
  getValidationConfig() {
    return this.config.validation
  }
  
  getContentFilteringConfig() {
    return this.config.contentFiltering
  }
  
  getWebhookConfig() {
    return this.config.webhook
  }
  
  getEmailConfig() {
    return this.config.email
  }
  
  getAdminConfig() {
    return this.config.admin
  }
  
  getMonitoringConfig() {
    return this.config.monitoring
  }
  
  // Check if a specific security feature is enabled
  isFeatureEnabled(feature: keyof SecurityConfig['monitoring']): boolean {
    return Boolean(this.config.monitoring[feature])
  }
  
  // Get environment-specific configuration
  getEnvironmentConfig(): string {
    return process.env.NODE_ENV || 'development'
  }
  
  // Check if running in production
  isProduction(): boolean {
    return this.getEnvironmentConfig() === 'production'
  }
  
  // Check if running in development
  isDevelopment(): boolean {
    return this.getEnvironmentConfig() === 'development'
  }
}

// Export default security configuration manager instance
export const securityConfig = new SecurityConfigManager() 