export type AppRole = 'developer' | 'user' | 'unauthentic-user'

export interface AccessIdentity {
  email: string
  sub?: string
  aud?: string
}

export interface AccessCheckResult {
  authenticated: boolean
  identity?: AccessIdentity
  role: AppRole
}

function splitCsv(value?: string): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export function getExpectedAudiences(env = process.env): string[] {
  return splitCsv(env.CF_ACCESS_AUD)
}

export function extractIdentityFromHeaders(headers: Headers, env = process.env): AccessIdentity | null {
  const email = headers.get('cf-access-authenticated-user-email')?.trim()
  if (!email) return null

  const aud = headers.get('cf-access-aud')?.trim() || undefined
  const sub = headers.get('cf-access-sub')?.trim() || undefined

  const expectedAudiences = getExpectedAudiences(env)
  if (expectedAudiences.length > 0 && (!aud || !expectedAudiences.includes(aud))) {
    return null
  }

  return { email, sub, aud }
}

export function resolveRole(identity: AccessIdentity | null, env = process.env): AppRole {
  if (!identity) return 'unauthentic-user'

  const developers = new Set(splitCsv(env.ACCESS_DEVELOPER_EMAILS).map((x) => x.toLowerCase()))
  if (developers.has(identity.email.toLowerCase())) return 'developer'

  return 'user'
}

export function checkAccess(headers: Headers, env = process.env): AccessCheckResult {
  const identity = extractIdentityFromHeaders(headers, env)
  const role = resolveRole(identity, env)
  return {
    authenticated: Boolean(identity),
    identity: identity ?? undefined,
    role,
  }
}
