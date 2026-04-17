import type { NextRequest } from 'next/server'

import type { Language } from '@/i18n/settings'

import acceptLanguage from 'accept-language'
import { NextResponse } from 'next/server'

import {
  COOKIE_NAME,
  FALLBACK_LNG,
  HEADER_NAME,
  LANGUAGES
} from '@/i18n/settings'
import { getSession } from '@/lib/auth'

acceptLanguage.languages([...LANGUAGES])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Language detection: Cookie → Accept-Language → fallback ──
  let lang = request.cookies.get(COOKIE_NAME)?.value

  if (!lang || !LANGUAGES.includes(lang as Language)) {
    lang =
      acceptLanguage.get(request.headers.get('Accept-Language')) ?? FALLBACK_LNG
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(HEADER_NAME, lang)

  // ── 2. Admin auth guard ──
  if (pathname.startsWith('/admin')) {
    const session = await getSession()

    if (!session || session?.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders }
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts).*)'
  ]
}
