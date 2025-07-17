import { createHmac } from 'crypto';
import { NextApiRequest } from 'next';

export const WEBHOOK_SECURITY_CONFIG = {
  SIGNATURE_HEADER: 'x-sanity-signature',
  TIMESTAMP_HEADER: 'x-sanity-timestamp',
  MAX_TIMESTAMP_AGE: 5 * 60 * 1000, // 5 minutes
  MIN_TIMESTAMP_AGE: -60 * 1000, // 1 minute in the future (clock skew)
  MAX_PAYLOAD_SIZE: 1024 * 1024, // 1MB
  REQUIRED_HEADERS: ['x-sanity-signature', 'x-sanity-timestamp', 'content-type'],
};

export function validateWebhookSignature(payload: string, signature: string, secret: string): { isValid: boolean; error?: string } {
  if (!signature || !secret) {
    return { isValid: false, error: 'Missing signature or secret' };
  }
  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    if (!constantTimeCompare(signature, expectedSignature)) {
      return { isValid: false, error: 'Invalid signature' };
    }
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Signature validation failed' };
  }
}

export function validateWebhookTimestamp(timestamp: string, maxAge = WEBHOOK_SECURITY_CONFIG.MAX_TIMESTAMP_AGE, minAge = WEBHOOK_SECURITY_CONFIG.MIN_TIMESTAMP_AGE): { isValid: boolean; error?: string } {
  if (!timestamp) {
    return { isValid: false, error: 'Missing timestamp' };
  }
  try {
    const timestampMs = parseInt(timestamp, 10);
    const now = Date.now();
    const age = now - timestampMs;
    if (age > maxAge) {
      return { isValid: false, error: 'Timestamp too old - possible replay attack' };
    }
    if (age < minAge) {
      return { isValid: false, error: 'Timestamp too far in future - possible clock skew' };
    }
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid timestamp format' };
  }
}

export function validateWebhookHeaders(headers: NextApiRequest['headers']): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  WEBHOOK_SECURITY_CONFIG.REQUIRED_HEADERS.forEach(header => {
    if (!headers[header]) {
      errors.push(`Missing required header: ${header}`);
    }
  });
  const contentType = headers['content-type'];
  if (contentType && !contentType.includes('application/json')) {
    errors.push('Invalid content-type - expected application/json');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePayloadSize(payload: string, maxSize = WEBHOOK_SECURITY_CONFIG.MAX_PAYLOAD_SIZE): { isValid: boolean; error?: string } {
  const size = Buffer.byteLength(payload, 'utf8');
  if (size > maxSize) {
    return {
      isValid: false,
      error: `Payload too large: ${size} bytes (max: ${maxSize})`,
    };
  }
  return { isValid: true };
}

export function extractWebhookData(req: NextApiRequest): {
  isValid: boolean;
  error?: string;
  data?: {
    payload: string;
    signature: string;
    timestamp: string;
    body: any;
  };
} {
  const payload = req.body ? JSON.stringify(req.body) : '';
  const sizeValidation = validatePayloadSize(payload);
  if (!sizeValidation.isValid) {
    return { isValid: false, error: sizeValidation.error };
  }
  const signature = req.headers[WEBHOOK_SECURITY_CONFIG.SIGNATURE_HEADER] as string;
  const timestamp = req.headers[WEBHOOK_SECURITY_CONFIG.TIMESTAMP_HEADER] as string;
  if (!signature || !timestamp) {
    return { isValid: false, error: 'Missing signature or timestamp headers' };
  }
  const headerValidation = validateWebhookHeaders(req.headers);
  if (!headerValidation.isValid) {
    return { isValid: false, error: headerValidation.errors.join(', ') };
  }
  const timestampValidation = validateWebhookTimestamp(timestamp);
  if (!timestampValidation.isValid) {
    return { isValid: false, error: timestampValidation.error };
  }
  return {
    isValid: true,
    data: {
      payload,
      signature,
      timestamp,
      body: req.body,
    },
  };
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = req.headers['x-real-ip'] as string;
  if (realIP) return realIP;
  return req.socket?.remoteAddress || 'unknown';
} 