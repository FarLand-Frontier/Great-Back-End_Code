import { describe, it, expect } from 'vitest'
import { checkAccess } from '../../src/lib/auth/cloudflareAccess'

describe('cloudflare access gate baseline', () => {
  it('denies when access identity header is missing', () => {
    const headers = new Headers()
    const result = checkAccess(headers, {})

    expect(result.authenticated).toBe(false)
    expect(result.role).toBe('unauthentic-user')
  })

  it('denies when aud is required but not matched', () => {
    const headers = new Headers({
      'cf-access-authenticated-user-email': 'dev@example.com',
      'cf-access-aud': 'wrong-aud',
    })

    const result = checkAccess(headers, {
      CF_ACCESS_AUD: 'expected-aud',
      ACCESS_DEVELOPER_EMAILS: 'dev@example.com',
    })

    expect(result.authenticated).toBe(false)
    expect(result.role).toBe('unauthentic-user')
  })

  it('passes with valid identity and role mapping', () => {
    const headers = new Headers({
      'cf-access-authenticated-user-email': 'dev@example.com',
      'cf-access-aud': 'expected-aud',
      'cf-access-sub': 'sub-123',
    })

    const result = checkAccess(headers, {
      CF_ACCESS_AUD: 'expected-aud',
      ACCESS_DEVELOPER_EMAILS: 'dev@example.com',
    })

    expect(result.authenticated).toBe(true)
    expect(result.role).toBe('developer')
    expect(result.identity?.sub).toBe('sub-123')
  })
})
