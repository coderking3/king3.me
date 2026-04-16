'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Animated } from '@/components/Animated'
import { Button } from '@/components/ui'
import { useTranslation } from '@/i18n/client'
import { cn } from '@/lib/utils'

import styles from '@/views/not-found/NotFound.module.css'

const STAR_COUNT = 60

interface Star {
  x: number
  y: number
  size: number
  delay: number
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4
  }))
}

interface ErrorPageProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  const { t } = useTranslation('common')

  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(generateStars(STAR_COUNT))
  }, [])

  useEffect(() => {
    console.error(error)
  }, [error])

  const largePlanetBg =
    'radial-gradient(circle at 35% 35%, #a9bcff 0%, #5f7fe8 38%, #2a3a6e 68%, transparent 100%)'

  const smallPlanetBg =
    'radial-gradient(circle at 40% 30%, #87e7b2 0%, #39b980 36%, #1a5b47 70%, transparent 100%)'

  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden',
        'bg-background'
      )}
    >
      {/* Star field */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={cn(
              'bg-foreground/40 absolute rounded-full dark:bg-white',
              styles.star
            )}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDuration: `${2 + star.delay}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating planet */}
      <motion.div
        className="absolute top-[8%] right-[10%] size-24 rounded-full opacity-20 md:size-32"
        style={{ background: largePlanetBg }}
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Small planet */}
      <motion.div
        className="absolute bottom-[15%] left-[8%] size-12 rounded-full opacity-15 md:size-16"
        style={{ background: smallPlanetBg }}
        animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* Icon */}
        <Animated
          preset={{ mode: 'fadeIn', duration: 0.5 }}
          className="text-brand mb-2"
        >
          <AlertTriangle className="size-24" />
        </Animated>

        {/* Title */}
        <Animated
          as="h1"
          preset={{ mode: 'fadeInUp', delay: 0.2, duration: 0.5 }}
          className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl"
        >
          {t('error.title', 'Something went wrong')}
        </Animated>

        {/* Description */}
        <Animated
          as="p"
          preset={{ mode: 'fadeInUp', delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground max-w-md text-base"
        >
          {t(
            'error.description',
            'An unexpected error interrupted this page. You can try again to recover the current route.'
          )}
        </Animated>

        {/* Error ID */}
        {error.digest ? (
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.5, duration: 0.4 }}
            className="text-muted-foreground/60 text-xs"
          >
            {t('error.errorId', 'Error ID')}: {error.digest}
          </Animated>
        ) : null}

        {/* Retry button */}
        <Animated preset={{ mode: 'fadeInUp', delay: 0.6, duration: 0.5 }}>
          <Button
            variant="outline"
            size="lg"
            onClick={() => unstable_retry()}
            className="border-border bg-secondary/50 text-muted-foreground hover:border-brand/40 hover:bg-secondary hover:text-foreground mt-4 inline-flex items-center gap-2 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--brand),0.15)]"
          >
            <RefreshCcw className="size-4" />
            {t('error.retry', 'Try again')}
          </Button>
        </Animated>
      </div>
    </main>
  )
}
