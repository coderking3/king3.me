'use client'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {
  initReactI18next,
  useTranslation as useI18nextTranslation
} from 'react-i18next'

import { backend, getI18nOptions, LANGUAGE_COOKIE, LANGUAGES } from './settings'

const runsOnServer = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(backend)
  .init({
    ...getI18nOptions(),
    lng: undefined,
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: LANGUAGE_COOKIE,
      caches: ['cookie']
    },
    preload: runsOnServer ? (LANGUAGES as unknown as string[]) : []
  })

const useTranslation = useI18nextTranslation

export { useTranslation }
export default i18next
