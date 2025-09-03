// Mock data factory for consistent testing
export const createMockPost = (overrides = {}) => ({
  _id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  _type: 'post',
  title: 'Test Post Title',
  slug: 'test-post-slug',
  excerpt: 'This is a test post excerpt that provides a brief overview of the content.',
  coverImage: {
    asset: {
      _ref: 'image-test-ref',
      _type: 'reference',
    },
    alt: 'Test cover image',
    hotspot: {
      x: 0.5,
      y: 0.5,
      height: 0.8,
      width: 0.8,
    },
    crop: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  date: '2024-01-01',
  author: {
    _ref: 'author-test-ref',
    _type: 'reference',
    name: 'Test Author',
    picture: {
      asset: {
        _ref: 'author-picture-ref',
        _type: 'reference',
      },
    },
    bio: 'This is a test author bio for testing purposes.',
  },
  content: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'This is test content for the post. It contains multiple sentences to test content rendering.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [
        {
          _type: 'span',
          text: 'Test Heading',
        },
      ],
      markDefs: [],
    },
  ],
  categories: [
    {
      _ref: 'category-test-ref',
      _type: 'reference',
      title: 'Test Category',
    },
  ],
  tags: ['test', 'example', 'blog'],
  ...overrides,
})

export const createMockVideo = (overrides = {}) => ({
  _id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  _type: 'video',
  title: 'Test Video Title',
  slug: 'test-video-slug',
  description: 'This is a test video description that explains what the video is about.',
  videoUrl: 'https://www.youtube.com/watch?v=test123',
  thumbnail: {
    asset: {
      _ref: 'video-thumbnail-ref',
      _type: 'reference',
    },
    alt: 'Test video thumbnail',
  },
  duration: '3:45',
  category: 'tutorial',
  date: '2024-01-01',
  featured: false,
  ...overrides,
})

export const createMockAuthor = (overrides = {}) => ({
  _id: `author-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  _type: 'author',
  name: 'Test Author Name',
  slug: 'test-author-slug',
  picture: {
    asset: {
      _ref: 'author-picture-ref',
      _type: 'reference',
    },
    alt: 'Test author picture',
  },
  bio: 'This is a test author bio that provides information about the author.',
  email: 'test.author@example.com',
  website: 'https://testauthor.com',
  ...overrides,
})

export const createMockCategory = (overrides = {}) => ({
  _id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  _type: 'category',
  title: 'Test Category',
  slug: 'test-category',
  description: 'This is a test category description.',
  color: '#007bff',
  ...overrides,
})

export const createMockContactSubmission = (overrides = {}) => ({
  _id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  _type: 'contactSubmission',
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for contact form testing.',
  submittedAt: new Date().toISOString(),
  status: 'pending',
  ...overrides,
})

export const createMockSettings = (overrides = {}) => ({
  _id: 'settings',
  _type: 'settings',
  title: 'Test Blog',
  description: 'This is a test blog description.',
  ogImage: {
    asset: {
      _ref: 'og-image-ref',
      _type: 'reference',
    },
    alt: 'Test OG image',
  },
  navigation: [
    {
      _type: 'navigationItem',
      title: 'Home',
      link: '/',
    },
    {
      _type: 'navigationItem',
      title: 'About',
      link: '/about',
    },
    {
      _type: 'navigationItem',
      title: 'Blog',
      link: '/posts',
    },
    {
      _type: 'navigationItem',
      title: 'Videos',
      link: '/videos',
    },
    {
      _type: 'navigationItem',
      title: 'Contact',
      link: '/contact',
    },
  ],
  socialMedia: {
    twitter: 'https://twitter.com/testblog',
    linkedin: 'https://linkedin.com/in/testblog',
    github: 'https://github.com/testblog',
  },
  ...overrides,
})

// Mock Sanity client responses
export const mockSanityClient = {
  fetch: jest.fn(),
  create: jest.fn(),
  createOrReplace: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  listen: jest.fn(),
  withConfig: jest.fn(() => mockSanityClient),
}

// Mock API responses
export const mockApiResponse = {
  success: (data: any) => ({
    ok: true,
    status: 200,
    json: async () => data,
  }),
  error: (status: number, message: string) => ({
    ok: false,
    status,
    json: async () => ({ error: message }),
  }),
}

// Mock environment variables
export const mockEnv = {
  SANITY_PROJECT_ID: 'test-project-id',
  SANITY_DATASET: 'test-dataset',
  SANITY_API_VERSION: '2024-01-01',
  RESEND_API_KEY: 'test-resend-api-key',
  CSRF_SECRET: 'test-csrf-secret',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',
}
