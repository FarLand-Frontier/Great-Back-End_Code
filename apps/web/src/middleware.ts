import { NextResponse, type NextRequest } from 'next/server'
import { checkAccess } from './lib/auth/cloudflareAccess'
import { canAccessPath } from './lib/auth/rolePolicy'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/unauthorized')) {
    return NextResponse.next()
  }

  const result = checkAccess(request.headers)

  // unauthentic user: no API access at all
  if (pathname.startsWith('/api') && result.role === 'unauthentic-user') {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  if (!canAccessPath(result.role, pathname)) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = request.nextUrl.clone()
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  const response = NextResponse.next()
  response.headers.set('x-app-role', result.role)
  if (result.identity?.email) response.headers.set('x-app-email', result.identity.email)
  if (result.identity?.sub) response.headers.set('x-app-sub', result.identity.sub)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
