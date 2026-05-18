'use client'

import type { InteractiveIconProps, SvgIcon } from '@/components/icons'
import type { Language } from '@/i18n/settings'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { switchLocaleAction } from '@/app/actions/i18n'
import { InteractiveIcon, LanguageIcon } from '@/components/icons'
import { useTranslation } from '@/i18n/client'

function ToggleLanguage({
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

  const switchLang = async (event: React.MouseEvent) => {
    event.preventDefault()
    const lang: Language = currentLang === 'en' ? 'zh' : 'en'

    const result = await switchLocaleAction(lang)
    i18n.changeLanguage(lang)

    if (result.success) {
      router.refresh()
    } else {
      toast.error(result.message)
    }
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

export default ToggleLanguage
