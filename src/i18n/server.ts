'use server'

import type { Language, Namespace } from './settings'

import { createInstance } from 'i18next'
import { cookies } from 'next/headers'
import { initReactI18next } from 'react-i18next/initReactI18next'

import {
  backend,
  DEFAULT_NS,
  FALLBACK_LNG,
  getI18nOptions,
  LANGUAGE_COOKIE
} from './settings'

async function initI18next(lng: Language, ns: Namespace) {
  const instance = createInstance()

  instance.use(initReactI18next)
  instance.use(backend)
  await instance.init(getI18nOptions(lng, ns))

  return instance
}

/**
 * Get translation function for Server Components / generateMetadata
 *
 * @example
 * const { t, lang } = await getT('about')
 * return <h1>{t('title')}</h1>
 */
export async function getT<N extends Namespace = typeof DEFAULT_NS>(
  ns: N = typeof DEFAULT_NS as N
) {
  const lang = await getLang()
  const i18next = await initI18next(lang, ns)

  return {
    t: i18next.getFixedT(lang, ns),
    lang,
    i18next
  }
}

// Utility function to get the locale from server components
export async function getLang() {
  const cookie = await cookies()
  const lang = (cookie.get(LANGUAGE_COOKIE)?.value ?? FALLBACK_LNG) as Language
  return lang
}
