import type { NextApiRequest, NextApiResponse } from 'next'

import { generateCSRFToken, generateSessionId } from '../../lib/csrf'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Generate session ID from request data
    const sessionId = generateSessionId(req)

    // Generate CSRF token
    const token = generateCSRFToken(sessionId)

    // Return the token
    res.status(200).json({
      token,
      sessionId,
      expiresIn: 30 * 60 * 1000, // 30 minutes in milliseconds
    })
  } catch (error) {
    console.error('CSRF token generation error:', error)
    res.status(500).json({
      error: 'Failed to generate security token',
    })
  }
}
