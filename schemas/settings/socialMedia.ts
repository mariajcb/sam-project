import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'socialMedia',
  title: 'Social Media Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Pinterest', value: 'pinterest' },
        ],
        layout: 'dropdown'
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      description: 'The full URL to your social media profile',
      validation: (rule) => rule.required().uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Brief description for accessibility (e.g., "Follow us on Instagram")',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this link appears in the footer',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      platform: 'platform',
      url: 'url',
    },
    prepare({ platform, url }) {
      return {
        title: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Media',
        subtitle: url,
      }
    },
  },
})
