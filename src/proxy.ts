import type { NextRequest } from 'next/server'

import type { Language } from '@/i18n/settings'

import acceptLanguage from 'accept-language'
import { NextResponse } from 'next/server'

import {
  FALLBACK_LNG,
  isValidLocale,
  LANGUAGE_COOKIE,
  LANGUAGES
} from '@/i18n/settings'
import { ADMIN_USER_ROLE } from '@/lib/auth'
import { getServerSession, requireServerAdminSession } from '@/lib/auth-session'

acceptLanguage.languages([...LANGUAGES])

// ── Locale ──

function detectLocale(request: NextRequest): {
  locale: Language
  persisted: boolean
} {
  const saved = request.cookies.get(LANGUAGE_COOKIE)?.value
  if (saved && LANGUAGES.includes(saved as Language)) {
    return { locale: saved as Language, persisted: true }
  }
  const matched = acceptLanguage.get(request.headers.get('Accept-Language'))
  return {
    locale: isValidLocale(matched) ? matched : FALLBACK_LNG,
    persisted: false
  }
}

function withLocale(
  response: NextResponse,
  locale: Language,
  persisted: boolean
) {
  if (!persisted) {
    response.cookies.set(LANGUAGE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })
  }
  return response
}

// ── Proxy ──

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, persisted } = detectLocale(request)

  const reply = (response: NextResponse) =>
    withLocale(response, locale, persisted)
  const redirect = (path: string) =>
    reply(NextResponse.redirect(new URL(path, request.url)))

  // Admin auth guard
  if (pathname.startsWith('/admin')) {
    try {
      await requireServerAdminSession(request.headers)
    } catch {
      return redirect('/')
    }
  }

  // Auth page: redirect if already signed in
  if (pathname === '/auth') {
    const session = await getServerSession(request.headers)

    if (session) {
      const redirectPath =
        session.user.role === ADMIN_USER_ROLE ? '/admin' : '/'
      return redirect(redirectPath)
    }
  }

  return reply(NextResponse.next())
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts).*)'
  ]
}
