import type { AppRole } from './cloudflareAccess'

const developerOnlyPrefixes = ['/admin', '/api/admin']
const userAllowedPagePrefixes = ['/', '/dashboard']
const userAllowedApiPrefixes = ['/api/chat', '/api/sessions', '/api/dashboard']

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  if (role === 'developer') return true
  if (role === 'unauthentic-user') return false

  if (startsWithAny(pathname, developerOnlyPrefixes)) return false

  if (pathname.startsWith('/api')) {
    return startsWithAny(pathname, userAllowedApiPrefixes)
  }

  return startsWithAny(pathname, userAllowedPagePrefixes)
}
