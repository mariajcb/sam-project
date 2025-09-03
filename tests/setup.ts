// Import test setup files
import './utils/test-utils'

// Global test configuration
beforeAll(() => {
  // Set up any global test configuration
  process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
})

afterAll(() => {
  // Clean up any global test configuration
  delete process.env.NEXT_PUBLIC_BASE_URL
})

// Suppress console warnings in tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Suppress specific warnings that are not relevant to tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('Warning: componentWillUpdate'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }

  console.error = (...args: any[]) => {
    // Suppress specific errors that are not relevant to tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('Warning: componentWillUpdate'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})
