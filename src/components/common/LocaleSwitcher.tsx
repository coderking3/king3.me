'use client'

import type { Locale } from 'next-intl'

import type { InteractiveIconProps, SvgIcon } from '@/components/icons'

import { useLocale, useTranslations } from 'next-intl'

import { InteractiveIcon, LanguageIcon } from '@/components/icons'
import { usePathname } from '@/i18n/navigation'

function ToggleLanguage({
  size,
  color,
  strokeWidth,
  ...delegated
}: InteractiveIconProps<SvgIcon>) {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('ui.actions')

  const switchLang = () => {
    const language: Locale = locale === 'en' ? 'zh' : 'en'

    // router.replace(pathname, { locale: language })
    // Kept for reference: this is the original SPA-based locale navigation method.
    // However, it may cause layout inconsistencies in the header due to
    // scroll state, DOM measurements, and CSS variable recalculations not being fully reset.

    // Full page reload is used instead to ensure a clean and consistent header layout state.
    window.location.href = `/${language}${pathname}`
  }

  return (
    <InteractiveIcon
      {...delegated}
      alt={t('LocaleSwitcher')}
      trigger="hover"
      onClick={switchLang}
    >
      {({ isHovered }) => (
        <LanguageIcon
          isEN={locale === 'en'}
          isHovered={isHovered}
          {...{ size, color, strokeWidth }}
        />
      )}
    </InteractiveIcon>
  )
}

export default ToggleLanguage
