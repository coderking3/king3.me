'use client'

import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'

import { Animated } from '@/components'
import { AUTHOR_INFO, SOCIAL_URLS } from '@/constants'
import { BiliBiliIcon, GithubIcon, XIcon, YoutubeIcon } from '@/icons'

const SOCIAL_LINKS = [
  { label: 'GitHub', icon: <GithubIcon size={18} />, href: SOCIAL_URLS.github },
  {
    label: 'Youtube',
    icon: <YoutubeIcon size={18} />,
    href: SOCIAL_URLS.youtube
  },
  {
    label: '哔哩哔哩',
    icon: <BiliBiliIcon size={18} />,
    href: SOCIAL_URLS.bilibili
  },
  { label: 'Twitter', icon: <XIcon size={18} />, href: SOCIAL_URLS.x }
]

const iconLinkClass =
  'border-border hover:border-foreground inline-flex items-center justify-center gap-1.5 border-b pb-0.5 text-base transition-colors duration-200'

function AboutSocial() {
  const { t } = useTranslation('about')

  return (
    <Animated preset={{ mode: 'fadeInUp', delay: 0.4 }}>
      <h2 className="text-muted-foreground mb-6 text-base font-medium">
        {t('social.findMeOn')}
      </h2>
      <div className="-mt-2 flex flex-wrap gap-2">
        {SOCIAL_LINKS.map(({ icon, label, href }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass}
          >
            {icon} {label}
          </Link>
        ))}
      </div>

      <p className="text-muted-foreground my-5">
        <Trans
          t={t}
          i18nKey="social.orMailMe"
          values={{ email: AUTHOR_INFO.email }}
          components={{
            email: (
              <Link
                href={`mailto:${AUTHOR_INFO.email}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            )
          }}
        />
      </p>
    </Animated>
  )
}

export default AboutSocial
