import type { NextRequest } from 'next/server'

import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'

import { routing } from '@/i18n/routing'
import { ADMIN_USER_ROLE } from '@/lib/auth'
import { getServerSession, requireServerAdminSession } from '@/lib/auth-session'

const intlMiddleware = createMiddleware(routing)

const ADMIN_GUARD_RE = /^\/(?:zh\/)?admin/
const AUTH_GUARD_RE = /^\/(?:zh\/)?auth$/

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin guard
  if (ADMIN_GUARD_RE.test(pathname)) {
    try {
      await requireServerAdminSession(request.headers)
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Auth page: redirect if already signed in
  if (AUTH_GUARD_RE.test(pathname)) {
    const session = await getServerSession(request.headers)

    if (session) {
      const redirectPath =
        session.user.role === ADMIN_USER_ROLE ? '/admin' : '/'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts).*)'
  ]
}
