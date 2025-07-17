import type { NextApiRequest, NextApiResponse } from 'next';

import { RateLimiter } from '../../lib/rate-limiter';
import { extractWebhookData, getClientIP, WEBHOOK_SECURITY_CONFIG } from '../../lib/webhook-security';

// In-memory rate limiters (per process)
const ipRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 10 }); // 10 req/min per IP
const webhookRateLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 100 }); // 100 req/min per endpoint

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate limit by IP
  const ip = getClientIP(req);
  if (!ipRateLimiter.isAllowed(ip)) {
    return res.status(429).json({ error: 'Too many requests (IP rate limit)' });
  }
  if (!webhookRateLimiter.isAllowed('contact-webhook')) {
    return res.status(429).json({ error: 'Too many requests (webhook rate limit)' });
  }

  // Validate webhook security (signature, timestamp, headers, size)
  const { isValid, error, data } = extractWebhookData(req);
  if (!isValid) {
    // Log security event (could be expanded)
    console.warn('[Webhook Security] Invalid request:', { ip, error });
    return res.status(400).json({ error: 'Invalid webhook: ' + error });
  }

  // At this point, the webhook is validated
  // TODO: Process the contact submission (e.g., send email, update status, etc.)

  // For now, just acknowledge
  res.status(200).json({ success: true, message: 'Webhook received and validated.' });
} 