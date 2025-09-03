import { rest } from 'msw'
import { createMockPost, createMockVideo, createMockContactSubmission } from './mockData'

// Base URL for API endpoints
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// API handlers for testing
export const handlers = [
  // Contact form submission
  rest.post(`${baseUrl}/api/submit-contact`, async (req, res, ctx) => {
    const body = await req.json()
    
    // Simulate validation
    if (!body.name || !body.email || !body.subject || !body.message) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Missing required fields' })
      )
    }
    
    // Simulate email validation
    if (!body.email.includes('@')) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid email format' })
      )
    }
    
    // Simulate successful submission
    const submission = createMockContactSubmission(body)
    return res(
      ctx.status(200),
      ctx.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        submission 
      })
    )
  }),

  // CSRF token endpoint
  rest.get(`${baseUrl}/api/csrf-token`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ 
        csrfToken: 'test-csrf-token-' + Date.now() 
      })
    )
  }),

  // Revalidation endpoint
  rest.post(`${baseUrl}/api/revalidate`, async (req, res, ctx) => {
    const body = await req.json()
    
    if (!body.secret || body.secret !== 'test-secret') {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid token' })
      )
    }
    
    return res(
      ctx.status(200),
      ctx.json({ 
        revalidated: true,
        message: 'Revalidation successful' 
      })
    )
  }),

  // OpenGraph image generation
  rest.get(`${baseUrl}/api/og`, (req, res, ctx) => {
    const title = req.url.searchParams.get('title') || 'Default Title'
    
    // Return a mock SVG response
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1f2937"/>
        <text x="600" y="315" font-family="Arial" font-size="48" fill="white" text-anchor="middle">${title}</text>
      </svg>
    `
    
    return res(
      ctx.status(200),
      ctx.set('Content-Type', 'image/svg+xml'),
      ctx.body(svg)
    )
  }),

  // Mock Sanity API endpoints
  rest.get(`${baseUrl}/api/sanity/*`, (req, res, ctx) => {
    const path = req.url.pathname
    
    if (path.includes('/posts')) {
      const posts = [
        createMockPost({ title: 'First Post' }),
        createMockPost({ title: 'Second Post' }),
        createMockPost({ title: 'Third Post' }),
      ]
      return res(ctx.status(200), ctx.json(posts))
    }
    
    if (path.includes('/videos')) {
      const videos = [
        createMockVideo({ title: 'First Video' }),
        createMockVideo({ title: 'Second Video' }),
      ]
      return res(ctx.status(200), ctx.json(videos))
    }
    
    return res(ctx.status(404), ctx.json({ error: 'Not found' }))
  }),

  // Mock external services
  rest.post('https://api.resend.com/emails', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ 
        id: 'test-email-id',
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject'
      })
    )
  }),

  // Fallback handler for unmatched requests
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`)
    return res(ctx.status(404), ctx.json({ error: 'Not found' }))
  }),
]

// Error handlers for testing error scenarios
export const errorHandlers = [
  // Simulate network error
  rest.all('*', (req, res, ctx) => {
    return res.networkError('Failed to connect')
  }),
]

// Delay handlers for testing loading states
export const delayHandlers = [
  rest.all('*', async (req, res, ctx) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return res(ctx.status(200), ctx.json({ message: 'Delayed response' }))
  }),
]
