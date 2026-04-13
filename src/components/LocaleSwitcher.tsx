'use client'

import type { Language } from '@/i18n/settings'

import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client'
import { COOKIE_NAME } from '@/i18n/settings'

export function LocaleSwitcher() {
  const router = useRouter()
  const { i18n, t } = useTranslation()
  const currentLang = (i18n.language ?? 'en') as Language

  const switchLang = (lang: Language) => {
    const maxAge = 60 * 60 * 24 * 365
    document.cookie = `${COOKIE_NAME}=${lang};path=/;max-age=${maxAge};SameSite=Lax`
    i18n.changeLanguage(lang)
    router.refresh()
  }

  const nextLang: Language = currentLang === 'en' ? 'zh' : 'en'

  return (
    <button
      type="button"
      onClick={() => switchLang(nextLang)}
      aria-label={t('localeSwitcher.label')}
      className="text-accent-foreground/85 hover:text-accent-foreground flex size-9 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-colors"
    >
      {currentLang === 'en' ? '中文' : 'EN'}
    </button>
  )
}
