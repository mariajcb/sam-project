import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

// Mock theme for styled-components
const mockTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
}

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={mockTheme}>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Common test data
export const mockPost = {
  _id: 'test-post-1',
  title: 'Test Post Title',
  slug: 'test-post-slug',
  excerpt: 'This is a test post excerpt',
  coverImage: {
    asset: {
      _ref: 'image-test-ref',
      _type: 'reference',
    },
    alt: 'Test cover image',
  },
  date: '2024-01-01',
  author: {
    name: 'Test Author',
    picture: {
      asset: {
        _ref: 'author-test-ref',
        _type: 'reference',
      },
    },
  },
  content: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'This is test content for the post.',
        },
      ],
    },
  ],
}

export const mockVideo = {
  _id: 'test-video-1',
  title: 'Test Video Title',
  slug: 'test-video-slug',
  description: 'This is a test video description',
  videoUrl: 'https://www.youtube.com/watch?v=test',
  thumbnail: {
    asset: {
      _ref: 'video-thumbnail-test-ref',
      _type: 'reference',
    },
  },
  duration: '3:45',
  category: 'tutorial',
  date: '2024-01-01',
}

export const mockContactData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for contact form testing.',
}

// Mock functions
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}

// Helper to wait for async operations
export const waitForElementToBeRemoved = (element: Element | null) => {
  return new Promise<void>((resolve) => {
    if (!element) {
      resolve()
      return
    }
    
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve()
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

// Helper to create mock event
export const createMockEvent = (overrides = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    value: '',
    name: '',
    checked: false,
    ...overrides,
  },
  ...overrides,
})
