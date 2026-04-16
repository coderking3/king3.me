'use client'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next, useTranslation } from 'react-i18next'

import { COOKIE_NAME, getI18nOptions, LANGUAGES } from './settings'

const runsOnServer = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getI18nOptions(),
    lng: undefined,
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: COOKIE_NAME,
      caches: ['cookie']
    },
    preload: runsOnServer ? (LANGUAGES as unknown as string[]) : []
  })

export { useTranslation }
export default i18next
