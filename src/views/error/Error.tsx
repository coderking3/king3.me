'use client'

import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'

import { Animated } from '@/components/Animated'
import { Button } from '@/components/ui'
import { useTranslation } from '@/i18n/client'
import ArtStarry from '@/layouts/ArtStarry'
import { cn } from '@/lib/utils'

interface ErrorComponentProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function ErrorComponent({
  error,
  unstable_retry
}: ErrorComponentProps) {
  const { t } = useTranslation('common')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden',
        'bg-background'
      )}
    >
      {/* Background */}
      <div className="pointer-events-none fixed top-0 left-0 z-0 size-dvw dark:invert">
        <ArtStarry />
      </div>

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
