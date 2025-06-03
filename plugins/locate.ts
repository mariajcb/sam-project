import { map, Observable } from 'rxjs'
import {
  DocumentLocationResolver,
  DocumentLocationsState,
} from 'sanity/presentation'

export const locate: DocumentLocationResolver = (params, context) => {
  // Immediately return for settings
  if (params.type === 'settings') {
    return {
      message: 'This document is used on all pages',
      tone: 'caution',
    }
  }

  // Immediately return for posts
  if (params.type === 'post') {
    return {
      locations: [
        {
          title: 'Posts',
          href: '/posts',
        },
      ],
    }
  }

  // Immediately return for authors
  if (params.type === 'author') {
    return {
      locations: [
        {
          title: 'Posts',
          href: '/posts',
        },
      ],
    }
  }

  return null
}
