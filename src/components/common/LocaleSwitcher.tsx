'use client'

import type { Locale } from 'next-intl'

import type { InteractiveIconProps, SvgIcon } from '@/components/icons'

import { useLocale, useTranslations } from 'next-intl'

import { InteractiveIcon, LanguageIcon } from '@/components/icons'
import { usePathname, useRouter } from '@/i18n/navigation'

function ToggleLanguage({
  size,
  color,
  strokeWidth,
  ...delegated
}: InteractiveIconProps<SvgIcon>) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('ui.actions')

  const switchLang = () => {
    const language: Locale = locale === 'en' ? 'zh' : 'en'

    router.replace(pathname, { locale: language })
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
