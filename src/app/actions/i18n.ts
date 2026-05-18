'use server'

import { cookies } from 'next/headers'

import { isValidLocale, LANGUAGE_COOKIE } from '@/i18n/settings'
import { failure, success } from '@/lib/result'

export async function switchLocaleAction(value: unknown) {
  if (!isValidLocale(value)) {
    return failure(new Error(`Unsupported locale: "${value}"`))
  }

  try {
    const cookie = await cookies()
    cookie.set(LANGUAGE_COOKIE, value, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })

    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}
