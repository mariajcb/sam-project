# Contact Form Setup Guide

## Overview
The contact form uses Vercel API routes with Resend for email delivery. It includes form validation, error handling, and a modern UI.

## Setup Steps

### 1. Install Dependencies
The Resend package has already been installed:
```bash
npm install resend
```

### 2. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:
```env
RESEND_API_KEY=re_your_api_key_here
```

### 4. Update Email Configuration
In `pages/api/contact.ts`, update these values:
- Line 28: Replace `'noreply@yourdomain.com'` with your verified domain
- Line 29: Replace `'your.email@example.com'` with your email address

### 5. Verify Your Domain (Optional but Recommended)
1. In Resend dashboard, go to Domains
2. Add and verify your domain
3. Use your verified domain in the "from" field

## Features
- ✅ Form validation (client & server-side)
- ✅ Email sending via Resend
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Loading states
- ✅ Success/error messages

## Testing
1. Start your development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out and submit the form
4. Check your email for the received message

## Deployment
- Deploy to Vercel with the environment variable set
- The API route will work automatically on Vercel
- No additional configuration needed

## Customization
- Update contact information in `pages/contact.tsx`
- Modify form fields in `components/ContactForm.tsx`
- Customize email template in `pages/api/contact.ts`
- Adjust styling using Tailwind classes 