import { setupServer } from 'msw/node'
import { handlers, errorHandlers, delayHandlers } from './handlers'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)

// Export handlers for use in individual tests
export { handlers, errorHandlers, delayHandlers }

// Enable API mocking before tests
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done
afterAll(() => server.close())

// Helper function to add custom handlers for specific tests
export const addCustomHandlers = (customHandlers: any[]) => {
  server.use(...customHandlers)
}

// Helper function to reset to default handlers
export const resetToDefaultHandlers = () => {
  server.resetHandlers()
  server.use(...handlers)
}

// Helper function to simulate network errors
export const simulateNetworkError = () => {
  server.use(...errorHandlers)
}

// Helper function to simulate slow responses
export const simulateSlowResponses = () => {
  server.use(...delayHandlers)
}
