import React from 'react'
import { render, screen } from '../utils/test-utils'
import { createMockPost } from '../mocks/mockData'

// Basic test to verify testing infrastructure is working
describe('Testing Infrastructure', () => {
  it('should have working test utilities', () => {
    const mockPost = createMockPost()
    expect(mockPost.title).toBe('Test Post Title')
    expect(mockPost.slug).toBe('test-post-slug')
  })

  it('should have working render function', () => {
    const TestComponent = () => <div>Test Component</div>
    render(<TestComponent />)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('should have working jest-dom matchers', () => {
    const TestComponent = () => (
      <div>
        <button disabled>Disabled Button</button>
        <input type="text" value="test value" readOnly />
      </div>
    )
    
    render(<TestComponent />)
    
    const button = screen.getByText('Disabled Button')
    const input = screen.getByDisplayValue('test value')
    
    expect(button).toBeDisabled()
    expect(input).toHaveValue('test value')
  })
})

// Test for mock data factory
describe('Mock Data Factory', () => {
  it('should create posts with custom overrides', () => {
    const customPost = createMockPost({
      title: 'Custom Title',
      slug: 'custom-slug',
    })
    
    expect(customPost.title).toBe('Custom Title')
    expect(customPost.slug).toBe('custom-slug')
    expect(customPost._id).toMatch(/^post-/)
    expect(customPost._type).toBe('post')
  })

  it('should generate unique IDs for each post', () => {
    const post1 = createMockPost()
    const post2 = createMockPost()
    
    expect(post1._id).not.toBe(post2._id)
  })

  it('should include all required post fields', () => {
    const post = createMockPost()
    
    expect(post).toHaveProperty('_id')
    expect(post).toHaveProperty('title')
    expect(post).toHaveProperty('slug')
    expect(post).toHaveProperty('excerpt')
    expect(post).toHaveProperty('coverImage')
    expect(post).toHaveProperty('date')
    expect(post).toHaveProperty('author')
    expect(post).toHaveProperty('content')
  })
})
