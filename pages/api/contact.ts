import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      })
    }

    if (!email.includes('@')) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      })
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <noreply@yourdomain.com>',
      to: ['your.email@example.com'], // Replace with your email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ 
        message: 'Failed to send email' 
      })
    }

    res.status(200).json({ 
      message: 'Message sent successfully!',
      data 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
} 