export const LANGUAGES = ['en', 'zh'] as const
export type Language = (typeof LANGUAGES)[number]

export const NAMESPACES = [
  'common',
  'home',
  'about',
  'blog',
  'project',
  'message',
  'poems',
  'photos',
  'use',
  'auth'
] as const
export type Namespace = (typeof NAMESPACES)[number]

export const FALLBACK_LNG: Language = 'en'
export const DEFAULT_NS: Namespace = 'common'
export const COOKIE_NAME = 'i18n_lang'
export const HEADER_NAME = 'x-i18n-lang'

export function getI18nOptions(
  lng: Language = FALLBACK_LNG,
  ns: Namespace | Namespace[] = DEFAULT_NS
) {
  return {
    supportedLngs: LANGUAGES as unknown as string[],
    fallbackLng: FALLBACK_LNG,
    lng,
    fallbackNS: DEFAULT_NS,
    defaultNS: DEFAULT_NS,
    ns,
    interpolation: {
      escapeValue: false
    }
  }
}
