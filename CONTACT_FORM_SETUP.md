# Contact Form Setup Guide

## Overview
The contact form uses Sanity CMS with webhooks for form submission handling. It includes form validation, error handling, and a modern UI. Form submissions are stored as Sanity documents and processed via webhooks.

## Setup Steps

### 1. Sanity Configuration
The Sanity webhook infrastructure is already configured in your project:
- `@sanity/webhook` package installed
- Webhook validation utilities available
- Sanity client configured

### 2. Create Contact Submission Schema
A new schema for contact form submissions will be created:
```typescript
// schemas/contactSubmission.ts
export default defineType({
  name: 'contactSubmission',
  title: 'Contact Form Submission',
  type: 'document',
  fields: [
    // name, email, subject, message, status, submittedAt
  ]
})
```

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:
```env
SANITY_API_WRITE_TOKEN=your_write_token_here
SANITY_CONTACT_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. Set Up Sanity Webhook
1. Go to your Sanity project dashboard
2. Navigate to API > Webhooks
3. Create a new webhook:
   - URL: `https://yourdomain.com/api/contact-webhook`
   - Dataset: Your current dataset
   - Trigger: "Create"
   - Filter: `_type == "contactSubmission"`
   - Secret: Use the same value as `SANITY_CONTACT_WEBHOOK_SECRET`

### 5. Update Form Configuration
The contact form will be modified to:
- Create Sanity documents instead of calling API routes
- Handle webhook-triggered email sending
- Provide real-time feedback

## Features
- ✅ Form validation (client & server-side)
- ✅ Sanity document storage
- ✅ Webhook-triggered email processing
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Loading states
- ✅ Success/error messages
- ✅ Admin interface in Sanity Studio

## Testing
1. Start your development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out and submit the form
4. Check Sanity Studio for the new submission
5. Verify webhook processing

## Deployment
- Deploy to Vercel with the environment variables set
- Configure webhook URL for production
- The webhook handler will work automatically on Vercel

## Customization
- Update contact information in `pages/contact.tsx`
- Modify form fields in `components/ContactForm.tsx`
- Customize webhook processing in `pages/api/contact-webhook.ts`
- Adjust styling using Tailwind classes
- Manage submissions in Sanity Studio

## Benefits of Sanity Webhook Approach
- **Reliability**: Sanity guarantees webhook delivery with retries
- **Data Integrity**: All submissions stored as structured documents
- **Scalability**: Can handle high-volume submissions
- **Monitoring**: Built-in webhook history and status tracking
- **Flexibility**: Easy to add multiple notification channels
- **Admin Interface**: View and manage submissions in Sanity Studio 