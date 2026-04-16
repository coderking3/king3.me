'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'

import { Animated } from '@/components/Animated'
import { Button } from '@/components/ui'
import { useTranslation } from '@/i18n/client'
import Background from '@/layouts/Background'
import { cn } from '@/lib/utils'

export default function NotFound() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 404 textShadow based on theme
  const textShadow404 = isDark
    ? '0 1px 0 rgba(255,255,255,0.35), 0 2px 0 rgba(180,190,255,0.24), 0 3px 0 rgba(120,136,214,0.18), 0 10px 24px rgba(0,0,0,0.45), 0 0 32px rgba(128,159,255,0.18)'
    : '0 1px 0 rgba(0,0,0,0.06), 0 2px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)'

  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden',
        'bg-background'
      )}
    >
      <Background art="starry" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* 404 text */}
        <div className="relative">
          <Animated
            as="span"
            preset={{ mode: 'fadeIn', duration: 0.6 }}
            className={cn(
              'pointer-events-none absolute inset-0 translate-x-2 translate-y-2 font-mono text-[8rem] leading-none font-bold opacity-80 blur-[1px] select-none md:text-[12rem]',
              isDark ? 'text-[#1a2340]' : 'text-muted'
            )}
            aria-hidden="true"
          >
            404
          </Animated>

          <Animated
            as="h1"
            preset={{ mode: 'fadeIn', duration: 0.6 }}
            className="text-foreground relative font-mono text-[8rem] leading-none font-bold select-none md:text-[12rem]"
            style={{ textShadow: textShadow404 }}
          >
            404
          </Animated>
        </div>

        {/* Title */}
        <Animated
          as="h2"
          preset={{ mode: 'fadeInUp', delay: 0.3, duration: 0.5 }}
          className="text-foreground text-2xl font-semibold tracking-wide md:text-3xl"
        >
          {t('notFound.title')}
        </Animated>

        {/* Description */}
        <Animated
          as="p"
          preset={{ mode: 'fadeInUp', delay: 0.5, duration: 0.5 }}
          className="text-muted-foreground max-w-md text-base"
        >
          {t('notFound.description')}
        </Animated>

        {/* Back home button */}
        <Animated preset={{ mode: 'fadeInUp', delay: 0.7, duration: 0.5 }}>
          <Button
            variant="outline"
            size="lg"
            className="border-border bg-secondary/50 text-muted-foreground hover:border-brand/40 hover:bg-secondary hover:text-foreground mt-4 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--brand),0.15)]"
            render={<Link href="/" />}
          >
            {t('notFound.backHome')}
          </Button>
        </Animated>
      </div>
    </main>
  )
}
