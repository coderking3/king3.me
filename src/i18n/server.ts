import type { Language } from './settings'

import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { headers } from 'next/headers'
import { initReactI18next } from 'react-i18next/initReactI18next'

import { FALLBACK_LNG, getI18nOptions, HEADER_NAME } from './settings'

async function initI18next(lng: Language, ns: string | string[]) {
  const instance = createInstance()
  instance.use(initReactI18next)
  instance.use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/locales/${language}/${namespace}.json`)
    )
  )
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
export async function getT(ns: string | string[] = 'common') {
  const headerList = await headers()
  const lang = (headerList.get(HEADER_NAME) as Language) ?? FALLBACK_LNG
  const i18next = await initI18next(lang, ns)

  return {
    t: i18next.getFixedT(lang, (Array.isArray(ns) ? ns[0] : ns) as any) as (
      key: string,
      options?: Record<string, unknown>
    ) => any,
    lang,
    i18next
  }
}
