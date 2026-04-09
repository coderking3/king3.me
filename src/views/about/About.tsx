'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Animated } from '@/components'
import { BrowserIcon, LogoIcon, PictureIcon, ServeIcon } from '@/icons'

import AboutSocial from './AboutSocial'

export const title = 'About Me'
export const description = `Hi, I'm King3. A frontend developer, open-source enthusiast, and creative soul.`

interface NowLinkGroup {
  label: string
  items: { name: string; href?: string; icon?: React.JSX.Element }[]
}

const NOW_LINKS: NowLinkGroup[] = [
  {
    label: 'Working as a',
    items: [{ name: 'Frontend Developer', icon: <BrowserIcon size={16} /> }]
  },
  {
    label: 'Creator of',
    items: [
      {
        name: 'Better Mock Server',
        icon: <ServeIcon size={16} />,
        href: 'https://github.com/OpenKnights/better-mock-server'
      },
      {
        name: 'King Images',
        icon: <PictureIcon size={20} />,
        href: 'https://github.com/coderking3/king-images'
      }
    ]
  },
  {
    label: 'Maintaining',
    items: [
      {
        name: 'OpenKnights',
        icon: <LogoIcon />,
        href: 'https://github.com/OpenKnights'
      }
    ]
  }
]

const linkClass =
  'text-foreground decoration-border hover:decoration-foreground underline decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200'

const badgeClass =
  'text-foreground/85 border-border/50 bg-accent/50 hover:text-foreground hover:border-border hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-sm no-underline transition-[border-color,background] duration-200'

function AboutPage() {
  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-[52rem] px-4 sm:px-8">
        {/* ── Headline ── */}
        <Animated preset="fadeInUp" className="mb-6 sm:mb-8">
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            King3.
          </h1>
          <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
            Frontend engineer · Open-source builder · Based in{' '}
            <span className="text-primary font-medium">ChangSha</span>
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
              {NOW_LINKS.map((group) => (
                <div
                  key={group.label}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {group.label}
                  {group.items.map((item) =>
                    item.href ? (
                      <Link
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={badgeClass}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ) : (
                      <span key={item.name} className={badgeClass}>
                        {item.icon}
                        {item.name}
                      </span>
                    )
                  )}
                </div>
              ))}
            </Animated>

            <Animated preset={{ mode: 'fadeInUp', delay: 0.16 }}>
              <p>
                Turning the ideas in my head into something real is what drives
                me. I build tools I wish existed and publish them on{' '}
                <Link
                  href="https://github.com/OpenKnights"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  OpenKnights
                </Link>{' '}
                and my{' '}
                <Link
                  href="https://github.com/coderking3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  GitHub
                </Link>
                . Find my{' '}
                <Link href="/project" className={linkClass}>
                  full projects list here
                </Link>
                .
              </p>
            </Animated>

            {/* Blog & sharing */}
            <Animated preset={{ mode: 'fadeInUp', delay: 0.2 }}>
              <p>
                I write{' '}
                <Link href="/blog" className={linkClass}>
                  blog posts
                </Link>{' '}
                and share tips on{' '}
                <Link
                  href="https://space.bilibili.com/627872080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  哔哩哔哩
                </Link>{' '}
                about programming, open source, and lessons learned along the
                way.
              </p>
            </Animated>

            {/* Outside of code */}
            <Animated preset={{ mode: 'fadeInUp', delay: 0.24 }}>
              <p>
                Outside of code, I enjoy{' '}
                <Link href="/photos" className={linkClass}>
                  photography
                </Link>
                , collecting{' '}
                <Link href="/poems" className={linkClass}>
                  poems
                </Link>
                , reading novels, and{' '}
                <Link
                  href="https://music.163.com/#/playlist?id=2675102592"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  listening to music
                </Link>
                . In case you are interested, here are the{' '}
                <Link href="/use" className={linkClass}>
                  hardware/software I use
                </Link>
                .
              </p>
            </Animated>

            {/* Location */}
            <Animated preset={{ mode: 'fadeInUp', delay: 0.28 }}>
              <p>
                I&apos;m based in{' '}
                <strong className="font-medium">ChangSha</strong>, if you are
                around, please{' '}
                <Link
                  href="https://space.bilibili.com/627872080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  reach out
                </Link>{' '}
                and let&apos;s grab a coffee or work on something together.
              </p>
            </Animated>
          </div>
        </div>

        {/* ── Separator ────────────────────────────────────── */}
        <Animated
          preset={{ mode: 'fadeInUp', delay: 0.36 }}
          className="flex justify-center"
        >
          <hr className="border-border mt-12 mb-10 w-16" />
        </Animated>

        {/* ── Social ───────────────────────────────────────── */}
        <AboutSocial />
      </div>
    </div>
  )
}

export default AboutPage
