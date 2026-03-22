import { describe, it, expect } from 'vitest'

// TDD Step 1: Write failing test - expecting app config module to exist
describe('App Smoke Test', () => {
  it('should export app config', async () => {
    const { appConfig } = await import('../../src/lib/config')
    expect(appConfig).toBeDefined()
    expect(appConfig).toHaveProperty('name')
    expect(appConfig).toHaveProperty('version')
  })
})
