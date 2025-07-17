import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactSubmission',
  title: 'Contact Form Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
      description: 'Fullname of the person submitting the form',
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email().max(254),
      description: 'Email address for contact',
    }),

    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
      description: 'Subject of the contact message',
    }),

    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule) => Rule.required().min(10).max(5000),
      description: 'Contact message content',
      options: {
        rows: 6,
      }
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: [
          { title: 'New', value: 'new' },
          { title: 'Read', value: 'read' },
          { title: 'Replied', value: 'replied' },
          { title: 'Archived', value: 'archived' },
          { title: 'Spam', value: 'spam' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      validation: (Rule) => Rule.required(),
      description: 'Current status of the submission,',
    }),

    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      validation: (Rule) => Rule.max(45),
      description: 'IP address of the submitter (for security tracking),    readOnly: true, // Security: Prevent manual editing',
    }),

    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
      validation: (Rule) => Rule.max(500),
      description: 'User agent string (for security tracking),    readOnly: true, // Security: Prevent manual editing',
    }),

    defineField({
      name: 'honeypot',
      title: 'Honeypot',
      type: 'string',
      validation: (Rule) => Rule.max(0), // Should always be empty
      description: 'Hidden field for spam detection (should always be empty)',
      hidden: true, // Security: Hide from Studio interface
      readOnly: true, // Security: Prevent manual editing
    }),

    defineField({
      name: 'submissionHash',
      title: 'Submission Hash',
      type: 'string',
      validation: (Rule) => Rule.max(64),
      description: 'SHA-256 hash of submission content (for duplicate detection),    readOnly: true, // Security: Prevent manual editing',
    }),

    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'Timestamp when the form was submitted,    readOnly: true, // Security: Prevent manual editing',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'processedAt',
      title: 'Processed At',
      type: 'datetime',
      description: 'Timestamp when the webhook processed this submission,    readOnly: true, // Security: Prevent manual editing',
    }),

    defineField({
      name: 'emailSentAt',
      title: 'Email Sent At',
      type: 'datetime',
      description: 'Timestamp when notification email was sent,    readOnly: true, // Security: Prevent manual editing',
    }),

    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      validation: (Rule) => Rule.max(1000),
      description: 'Internal notes for admin use only',
      hidden: true, // Security: Hide from public view
    }),

    defineField({
      name: 'spamScore',
      title: 'Spam Score',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Spam detection score (0-100gher = more likely spam),    readOnly: true, // Security: Prevent manual editing',
      initialValue: 0,

    // Security: Security flags
    defineField({
      name: 'securityFlags',
      title: 'Security Flags',
      type: 'array',
      of: [{ type: 'string' }],
      options: [
          { title: 'Suspicious IP', value: 'suspicious_ip' },
          { title: 'Disposable Email', value: 'disposable_email' },
          { title: 'Fast Submission', value: 'fast_submission' },
          { title: 'Duplicate Content', value: 'duplicate_content' },
          { title: 'Suspicious Content', value: 'suspicious_content' },
          { title: 'Rate Limited', value: 'rate_limited' },
        ],
      },
      description: 'Security flags raised during submission processing,    readOnly: true, // Security: Prevent manual editing',
    }),
  ],

  // Preview configuration for Studio
  preview: {
    select: {
      title: 'name,
      subtitle: 'subject,   status: 'status',
      email: 'email,
      submittedAt: 'submittedAt',
    },
    prepare(selection) {
      const { title, subtitle, status, email, submittedAt } = selection
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString() : 'No date'
      
      return {
        title: title || 'Anonymous',
        subtitle: `${subtitle || 'No subject'} - ${email || 'No email'} (${status || 'new'})`,
        media: () => '📧',
        description: `Submitted: ${date}`,
      }
    },
  },

  // Order by submission date (newest first)
  orderings: [
    {
      title: 'Submission Date, New',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Submission Date, Old',
      name: 'submittedAtAsc',
      by: [{ field: 'submittedAt', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: { field: 'status', direction: 'asc' },
    },
  ],
}) 