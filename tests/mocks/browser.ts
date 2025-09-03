import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Export handlers for use in individual tests
export { handlers }

// Helper function to start the worker
export const startWorker = () => {
  if (typeof window !== 'undefined') {
    worker.start()
  }
}

// Helper function to stop the worker
export const stopWorker = () => {
  if (typeof window !== 'undefined') {
    worker.stop()
  }
}
