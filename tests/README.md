# Testing Infrastructure

This directory contains the testing setup for the blog application, following Kent C. Dodds' testing philosophy: **"Write tests. Not too many. Mostly integration."**

## Directory Structure

```
tests/
├── unit/           # Unit tests for individual functions/utilities
├── integration/    # Integration tests for component interactions
├── e2e/           # End-to-end workflow tests
├── utils/          # Test utilities and helpers
├── mocks/          # Mock data and API handlers
└── __mocks__/      # Jest module mocks
```

## Test Scripts

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI environment

## Testing Philosophy

### What We Test (High Confidence)
- **Integration tests** that verify components work together
- **User workflows** rather than implementation details
- **Critical utilities** like email validation and CSRF protection
- **API endpoints** with real request/response cycles

### What We Don't Test (Low Value)
- **Implementation details** that change frequently
- **Third-party libraries** (Jest, React Testing Library, etc.)
- **Trivial functions** with no business logic
- **Exact CSS classes** or styling details

## Test Utilities

### `test-utils.tsx`
- Custom render function with providers
- Mock theme for styled-components
- Common test data and mock functions
- Helper utilities for async operations

### `mockData.ts`
- Factory functions for creating test data
- Consistent mock objects for posts, videos, authors
- Configurable overrides for specific test scenarios

### `handlers.ts` & `server.ts`
- MSW (Mock Service Worker) setup for API mocking
- Predefined handlers for common API endpoints
- Error and delay handlers for testing edge cases

## Writing Tests

### Component Tests
```tsx
import { render, screen } from '../utils/test-utils'
import { ContactForm } from '../../components/ContactForm'

describe('ContactForm', () => {
  it('should submit form successfully', async () => {
    render(<ContactForm />)
    // Test implementation
  })
})
```

### API Tests
```tsx
import { server, addCustomHandlers } from '../mocks/server'

describe('Contact API', () => {
  it('should handle successful submission', async () => {
    addCustomHandlers([
      rest.post('/api/submit-contact', (req, res, ctx) => {
        return res(ctx.json({ success: true }))
      })
    ])
    // Test implementation
  })
})
```

### Utility Tests
```tsx
import { validateEmail } from '../../lib/email-validation'

describe('Email Validation', () => {
  it('should validate correct email formats', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
  })
})
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the user sees/does
2. **Use descriptive test names** - Clear about what is being tested
3. **Arrange-Act-Assert** - Structure tests in three clear sections
4. **Mock external dependencies** - Don't test third-party services
5. **Test error scenarios** - Verify error handling works correctly
6. **Keep tests fast** - Use integration tests sparingly, prefer unit tests

## Coverage Goals

- **70% minimum coverage** for all code
- **Higher coverage** for critical business logic
- **Lower coverage** for UI components and styling

## Troubleshooting

### Common Issues
- **MSW not working** - Ensure server is imported in test files
- **Styled-components errors** - Check theme provider setup
- **Next.js Image errors** - Verify mock is working correctly
- **Router errors** - Check router mock configuration

### Debug Mode
Run tests with `--verbose` flag for detailed output:
```bash
npm test -- --verbose
```

## Next Steps

1. **Phase 2**: Write unit tests for utility functions
2. **Phase 3**: Create integration tests for components
3. **Phase 4**: Test API routes and endpoints
4. **Phase 5**: Implement end-to-end workflow tests
5. **Phase 6**: Optimize test performance and add CI/CD
