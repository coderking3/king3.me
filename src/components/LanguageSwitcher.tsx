'use client'

import type { Language } from '@/i18n/settings'
import type { InteractiveIconProps, SvgIcon } from '@/icons'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { COOKIE_NAME } from '@/i18n/settings'
import { InteractiveIcon, LanguageIcon } from '@/icons'

export function LanguageSwitcher({
  size,
  color,
  strokeWidth,
  ...delegated
}: InteractiveIconProps<SvgIcon>) {
  const router = useRouter()
  const { i18n, t } = useTranslation()
  const currentLang = (i18n.language ?? 'en') as Language
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const switchLang = (event: React.MouseEvent) => {
    event.preventDefault()
    const nextLang: Language = currentLang === 'en' ? 'zh' : 'en'
    const maxAge = 60 * 60 * 24 * 365
    document.cookie = `${COOKIE_NAME}=${nextLang};path=/;max-age=${maxAge};SameSite=Lax`
    i18n.changeLanguage(nextLang)
    router.refresh()
  }

  if (!mounted) {
    return (
      <InteractiveIcon {...delegated} trigger="hover">
        {() => (
          <LanguageIcon
            isEN
            isHovered={false}
            {...{ size, color, strokeWidth }}
          />
        )}
      </InteractiveIcon>
    )
  }

  const isEN = currentLang === 'en'

  return (
    <InteractiveIcon
      {...delegated}
      alt={t('localeSwitcher.label')}
      trigger="hover"
      onClick={switchLang}
    >
      {({ isHovered }) => (
        <LanguageIcon
          isEN={isEN}
          isHovered={isHovered}
          {...{ size, color, strokeWidth }}
        />
      )}
    </InteractiveIcon>
  )
}
