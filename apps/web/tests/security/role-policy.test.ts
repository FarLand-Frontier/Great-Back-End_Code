import { describe, it, expect } from 'vitest'
import { canAccessPath } from '../../src/lib/auth/rolePolicy'

describe('role policy', () => {
  it('developer has full access', () => {
    expect(canAccessPath('developer', '/admin/copy')).toBe(true)
    expect(canAccessPath('developer', '/api/admin/copy/save')).toBe(true)
  })

  it('user can access business pages/apis but not admin', () => {
    expect(canAccessPath('user', '/dashboard')).toBe(true)
    expect(canAccessPath('user', '/api/chat/send')).toBe(true)
    expect(canAccessPath('user', '/api/sessions/list')).toBe(true)

    expect(canAccessPath('user', '/admin/copy')).toBe(false)
    expect(canAccessPath('user', '/api/admin/copy/save')).toBe(false)
  })

  it('unauthentic user cannot access any route', () => {
    expect(canAccessPath('unauthentic-user', '/')).toBe(false)
    expect(canAccessPath('unauthentic-user', '/api/chat/send')).toBe(false)
  })
})
