import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'The URL path for this navigation item (e.g., /about)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description that appears when hovering over the navigation item',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'link',
    },
  },
}) 