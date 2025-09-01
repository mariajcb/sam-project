import groq from 'groq'

const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

const videoFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  description,
  videoUrl,
  coverImage,
  "slug": slug.current,
  "categories": categories[]->{title, description},
`

export const settingsQuery = groq`*[_type == "settings"][0]{
  title,
  description,
  navigation,
  showBlog,
  ogImage,
  "socialMedia": socialMedia[] | order(order asc) {
    platform,
    url,
    description
  }
}`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const videosQuery = groq`
*[_type == "video"] | order(date desc, _updatedAt desc) {
  ${videoFields}
}`

export const videoBySlugQuery = groq`
*[_type == "video" && slug.current == $slug][0] {
  ${videoFields}
}
`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const videoSlugsQuery = groq`
*[_type == "video" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
}

export interface Video {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  _updatedAt?: string
  description?: string
  videoUrl?: string
  slug?: string
  categories?: Category[]
}

export interface Category {
  title: string
  description?: string
}

export interface Author {
  name: string
  picture?: any
}

export interface NavigationItem {
  _key: string
  title: string
  link: string
  description?: string
}

export interface SocialMedia {
  platform: string
  url: string
  description?: string
}

export interface Settings {
  title?: string
  description?: any[]
  navigation?: NavigationItem[]
  ogImage?: {
    title?: string
  }
  showBlog?: boolean
  socialMedia?: SocialMedia[]
}
