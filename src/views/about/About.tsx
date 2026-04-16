'use client'

import { Toolbox } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'

import { Animated } from '@/components'
import { SOCIAL_URLS } from '@/constants'
import {
  BrowserIcon,
  CameraIcon,
  FeatherIcon,
  LogoIcon,
  PictureIcon,
  ServeIcon
} from '@/icons'

import AboutSocial from './AboutSocial'

const EXPLORE_LINKS = [
  { key: 'photos', href: '/photos', icon: <CameraIcon size={18} /> },
  { key: 'poems', href: '/poems', icon: <FeatherIcon size={18} /> },
  { key: 'use', href: '/use', icon: <Toolbox size={18} /> }
]

const NOW_LINKS = [
  {
    labelKey: 'workingAs',
    items: [{ nameKey: 'frontendDeveloper', icon: <BrowserIcon size={16} /> }]
  },
  {
    labelKey: 'creatorOf',
    items: [
      {
        name: 'Better Mock Server',
        icon: <ServeIcon size={16} />,
        href: `${SOCIAL_URLS.openknights}/better-mock-server`
      },
      {
        name: 'King Images',
        icon: <PictureIcon size={20} />,
        href: `${SOCIAL_URLS.github}/king-images`
      }
    ]
  },
  {
    labelKey: 'maintaining',
    items: [
      {
        name: 'OpenKnights',
        icon: <LogoIcon />,
        href: SOCIAL_URLS.openknights
      }
    ]
  }
]

const linkClass =
  'text-foreground decoration-border hover:decoration-foreground underline decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200'

const badgeClass =
  'text-foreground/85 border-border/50 bg-accent/50 hover:text-foreground hover:border-border hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-sm no-underline transition-[border-color,background] duration-200'

function AboutPage() {
  const { t } = useTranslation('about')

  const { t: commonT } = useTranslation('common')

  const exploreLinks = EXPLORE_LINKS.map((item) => ({
    ...item,
    name: commonT(`metadata.${item.key}.title` as any)
  }))

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-[54rem] px-4 sm:px-8">
        {/* ── Headline ── */}
        <Animated preset="fadeInUp" className="mb-6 sm:mb-8">
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            King3.
          </h1>
          <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
            {t('subtitle')}
            <span className="text-primary font-medium">{t('city')}</span>
          </p>
        </Animated>

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="text-muted-foreground text-base leading-[1.85] font-medium">
          <Animated preset={{ mode: 'fadeInUp', delay: 0.08 }}>
            <Image
              src="/images/avatar.png"
              alt="king3"
              width={160}
              height={160}
              className="border-border/50 float-left mr-5 mb-2 size-40 rounded-xl border sm:size-72"
            />
          </Animated>

          <div className="space-y-4">
            {/* Now Links */}
            <Animated
              preset={{ mode: 'fadeInUp', delay: 0.12 }}
              className="hidden space-y-2 leading-[1.75] sm:block"
            >
              {NOW_LINKS.map((group: any) => (
                <div
                  key={group.labelKey}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {t(group.labelKey)}
                  {group.items.map((item: any) => {
                    const name: string = item.nameKey
                      ? t(item.nameKey)
                      : item.name
                    return item.href ? (
                      <Link
                        key={name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={badgeClass}
                      >
                        {item.icon}
                        {name}
                      </Link>
                    ) : (
                      <span key={name} className={badgeClass}>
                        {item.icon}
                        {name}
                      </span>
                    )
                  })}
                </div>
              ))}
            </Animated>

            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.16 }}>
              <Trans
                t={t}
                i18nKey="paragraph1"
                components={{
                  openknights: (
                    <Link
                      href={SOCIAL_URLS.openknights}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    />
                  ),
                  github: (
                    <Link
                      href={SOCIAL_URLS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    />
                  ),
                  projects: <Link href="/project" className={linkClass} />
                }}
              />
            </Animated>

            {/* Blog & sharing */}
            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.2 }}>
              <Trans
                t={t}
                i18nKey="paragraph2"
                components={{
                  blog: <Link href="/blog" className={linkClass} />,
                  bilibili: (
                    <Link
                      href={SOCIAL_URLS.bilibili}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    />
                  )
                }}
              />
            </Animated>

            {/* Outside of code */}
            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.24 }}>
              <Trans
                t={t}
                i18nKey="paragraph3"
                components={{
                  photos: <Link href="/photos" className={linkClass} />,
                  poems: <Link href="/poems" className={linkClass} />,
                  music: (
                    <Link
                      href="https://music.163.com/#/playlist?id=2675102592"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    />
                  ),
                  use: <Link href="/use" className={linkClass} />
                }}
              />
            </Animated>

            {/* Location */}
            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.28 }}>
              <Trans
                t={t}
                i18nKey="paragraph4"
                values={{ city: t('city') }}
                components={{
                  strong: <strong className="text-foreground font-medium" />,
                  contact: (
                    <Link
                      href={SOCIAL_URLS.bilibili}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    />
                  )
                }}
              />
            </Animated>
          </div>
        </div>

        <Animated
          preset={{ mode: 'fadeInUp', delay: 0.36 }}
          className="flex justify-center"
        >
          <hr className="border-border my-8 w-16" />
        </Animated>

        {/* ── Social ── */}
        <AboutSocial />

        <Animated
          preset={{ mode: 'fadeInUp', delay: 0.36 }}
          className="flex justify-center"
        >
          <hr className="border-border my-8 w-16" />
        </Animated>

        {/* ── Explore ── */}
        <Animated preset={{ mode: 'fadeInUp', delay: 0.44 }}>
          <h2 className="text-muted-foreground mb-6 text-base font-medium">
            {t('exploreMore')}
          </h2>
          <div className="-mt-2 flex flex-wrap gap-2">
            {exploreLinks.map(({ name, href, icon }) => (
              <Link
                key={name}
                href={href}
                className="border-border hover:border-foreground inline-flex items-center justify-center gap-1.5 border-b pb-0.5 text-base transition-colors duration-200"
              >
                {icon} {name}
              </Link>
            ))}
          </div>
        </Animated>
      </div>
    </div>
  )
}

export default AboutPage
