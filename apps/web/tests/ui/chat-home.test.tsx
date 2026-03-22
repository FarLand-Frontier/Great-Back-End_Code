import { describe, it, expect } from 'vitest'

// TDD Step 1: Write the failing test
// This test expects the home page to render title, placeholder, and quick prompts from uiCopy contract

describe('Chat Home Screen', () => {
  it('should render title, placeholder text, and 3 quick prompts from uiCopy contract', async () => {
    // Dynamic import to ensure we're testing the actual implementation
    const { getHomeCopy } = await import('../../src/lib/uiCopy')
    const homeCopy = getHomeCopy()
    
    // Assert title exists
    expect(homeCopy.title).toBeDefined()
    expect(typeof homeCopy.title).toBe('string')
    
    // Assert placeholder exists
    expect(homeCopy.placeholder).toBeDefined()
    expect(typeof homeCopy.placeholder).toBe('string')
    
    // Assert 3 quick prompts exist
    expect(homeCopy.quickPrompts).toBeDefined()
    expect(Array.isArray(homeCopy.quickPrompts)).toBe(true)
    expect(homeCopy.quickPrompts.length).toBe(3)
    
    // Assert each prompt has required fields
    homeCopy.quickPrompts.forEach((prompt: { id: string; text: string }) => {
      expect(prompt.id).toBeDefined()
      expect(prompt.text).toBeDefined()
    })
  })
})
