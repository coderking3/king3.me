import type { CustomTypeOptions, InitOptions } from 'i18next'

import resourcesToBackend from 'i18next-resources-to-backend'

export const LANGUAGES = ['en', 'zh'] as const
export type Language = (typeof LANGUAGES)[number]
export type Namespace = keyof CustomTypeOptions['resources']

export const DEFAULT_LNG: Language = 'en'
export const DEFAULT_NS: Namespace = 'common'
export const LANGUAGE_COOKIE = 'i18n_lang'

export const backend = resourcesToBackend(
  (locale: string, namespace: string) =>
    import(`@/i18n/language/${locale}/${namespace}.json`)
)

export function isValidLocale(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language)
}

export function getI18nOptions(
  lng: Language = DEFAULT_LNG,
  ns: Namespace = DEFAULT_NS
): InitOptions {
  return {
    lng,
    fallbackLng: DEFAULT_LNG,
    supportedLngs: LANGUAGES as unknown as string[],
    ns,
    fallbackNS: DEFAULT_NS,
    defaultNS: DEFAULT_NS,
    interpolation: {
      escapeValue: false
    },
    returnNull: false
  }
}
