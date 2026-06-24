'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Animated } from '@/components/common'
import {
  BrowserIcon,
  LogoIcon,
  PictureIcon,
  ServeIcon
} from '@/components/icons'
import { SOCIAL_URLS } from '@/constants'
import { Link } from '@/i18n/navigation'

import AboutSocial from './AboutSocial'

const NOW_LINKS = [
  {
    labelKey: 'workingAs',
    items: [{ nameKey: 'currentJob', icon: <BrowserIcon size={16} /> }]
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
        icon: <LogoIcon variant="bold" />,
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
  const t = useTranslations('page.about')

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
                    const name: string = item.name ?? t(item.nameKey)

                    if (item.href) {
                      return (
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
                      )
                    }

                    return (
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
              {t.rich('paragraphs.0', {
                openknights: (chunks) => (
                  <Link
                    href={SOCIAL_URLS.openknights}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {chunks}
                  </Link>
                ),
                github: (chunks) => (
                  <Link
                    href={SOCIAL_URLS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {chunks}
                  </Link>
                ),
                projects: (chunks) => (
                  <Link href="/project" className={linkClass}>
                    {chunks}
                  </Link>
                )
              })}
            </Animated>

            {/* Blog & sharing */}
            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.2 }}>
              {t.rich('paragraphs.1', {
                blog: (chunks) => (
                  <Link href="/blog" className={linkClass}>
                    {chunks}
                  </Link>
                ),
                bilibili: (chunks) => (
                  <Link
                    href={SOCIAL_URLS.bilibili}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {chunks}
                  </Link>
                )
              })}
            </Animated>

            {/* Outside of code */}
            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.24 }}>
              {t.rich('paragraphs.2', {
                photos: (chunks) => (
                  <Link href="/photos" className={linkClass}>
                    {chunks}
                  </Link>
                ),
                poems: (chunks) => (
                  <Link href="/poems" className={linkClass}>
                    {chunks}
                  </Link>
                ),
                // eslint-disable-next-line react/no-unnecessary-use-prefix, react/component-hook-factories
                use: (chunks) => (
                  <Link href="/use" className={linkClass}>
                    {chunks}
                  </Link>
                ),
                music: (chunks) => (
                  <Link
                    href="https://music.163.com/#/playlist?id=2675102592"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {chunks}
                  </Link>
                )
              })}
            </Animated>

            {/* Location */}
            <Animated as="p" preset={{ mode: 'fadeInUp', delay: 0.28 }}>
              {t.rich('paragraphs.3', {
                city: t('city'),
                strong: (chunks) => (
                  <strong className="text-foreground font-medium">
                    {chunks}
                  </strong>
                ),
                contact: (chunks) => (
                  <Link
                    href={SOCIAL_URLS.bilibili}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {chunks}
                  </Link>
                )
              })}
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
      </div>
    </div>
  )
}

export default AboutPage
