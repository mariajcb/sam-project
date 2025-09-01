import { CogIcon } from '@sanity/icons'
import * as demo from 'lib/demo.data'
import { defineArrayMember, defineField, defineType } from 'sanity'

import OpenGraphInput from './OpenGraphInput'
import navigationItem from './navigation'
import socialMedia from './socialMedia'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  preview: { select: { title: 'title', subtitle: 'description' } },
  // Uncomment below to have edits publish automatically as you type
  liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your blog.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description:
        'Used both for the <meta> description tag for SEO, and the blog subheader.',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      description: 'Configure the main navigation items for your site',
      type: 'array',
      of: [{ type: 'navigationItem' }],
      validation: (rule) => rule.unique().required(),
    }),
    defineField({
      name: 'showBlog',
      title: 'Show Blog Section',
      description: 'Toggle the visibility of the blog section on your site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      description:
        'Used for social media previews when linking to the index page.',
      type: 'object',
      components: {
        input: OpenGraphInput as any,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: demo.ogImageTitle,
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      description: 'Add your social media profiles to display in the footer',
      type: 'array',
      of: [{ type: 'socialMedia' }],
      initialValue: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/your-profile',
          description: 'Follow us on LinkedIn',
          order: 0,
        },
        {
          platform: 'instagram',
          url: 'https://instagram.com/your-profile',
          description: 'Follow us on Instagram',
          order: 1,
        },
      ],
    }),
  ],
})
