import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
  validateSanityEnvironment,
  getWriteToken,
} from 'lib/sanity.api'
import {
  indexQuery,
  type Post,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'

import { handleSecurityError } from './security'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
})

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
    token: preview?.token,
  })
  return client
}

/**
 * Get a Sanity client with write permissions for creating documents
 * This should only be used on the server side for security
 */
export function getWriteClient(): SanityClient {
  try {
    // Validate environment variables
    validateSanityEnvironment()
    
    // Get and validate write token
    const writeToken = getWriteToken()
    
    // Create secure client with write permissions
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // Always use fresh data for write operations
      perspective: 'published',
      token: writeToken,
    })
    
    return client
  } catch (error) {
    const securityError = handleSecurityError(error, 'getWriteClient')
    console.error('Failed to create write client:', error)
    throw new Error(securityError.message)
  }
}

/**
 * Secure document creation with validation and error handling
 * This is a wrapper around the write client for additional security
 */
export async function createSecureDocument(document: any, documentType: string): Promise<any> {
  try {
    const writeClient = getWriteClient()
    
    // Add security metadata
    const secureDocument = {
      ...document,
      _type: documentType,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      // Add security tracking
      _security: {
        createdVia: 'contact-form',
        timestamp: new Date().toISOString(),
        version: '1.0',
      }
    }
    
    const result = await writeClient.create(secureDocument)
    
    // Log successful creation (without sensitive data)
    console.log(`Successfully created ${documentType} document:`, { 
      id: result._id, 
      type: documentType,
      timestamp: new Date().toISOString()
    })
    
    return result
  } catch (error) {
    const securityError = handleSecurityError(error, 'createSecureDocument')
    console.error(`Failed to create ${documentType} document:`, error)
    throw new Error(securityError.message)
  }
}

export const getSanityImageConfig = () => getClient()

export async function getSettings(client: SanityClient): Promise<Settings> {
  return (await client.fetch(settingsQuery)) || {}
}

export async function getAllPosts(client: SanityClient): Promise<Post[]> {
  return (await client.fetch(indexQuery)) || []
}

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}

export async function getPostBySlug(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
}

export async function getPostAndMoreStories(
  client: SanityClient,
  slug: string,
): Promise<{ post: Post; morePosts: Post[] }> {
  return (await client.fetch(postAndMoreStoriesQuery, { slug })) || {
    post: {} as any,
    morePosts: [],
  }
}
