'use client'

import { ArrowRight, Camera, Compass, Feather, Toolbox } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { EXPLORE_LINKS } from '@/constants/nav'
import { useTranslation } from '@/i18n/client'

const ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  photos: Camera,
  poems: Feather,
  use: Toolbox
}

export default function Explore() {
  const { t } = useTranslation('home')
  const { t: commonT } = useTranslation('common')

  return (
    <div className="border-border bg-background/30 rounded-2xl border p-6 backdrop-blur-xs">
      {/* Header — aligned with FeaturedMusic */}
      <h2 className="text-primary mb-6 flex items-center text-base font-semibold">
        <Compass size={18} />
        <span className="ml-3">{t('exploreMore')}</span>
      </h2>

      <div className="space-y-4">
        <Suspense fallback={null}>
          {EXPLORE_LINKS.map(({ key, href }) => {
            const Icon = ICONS[key]

            return (
              <Link
                key={key}
                href={href}
                prefetch={true}
                className="group relative flex cursor-pointer items-center gap-3"
              >
                {/* Icon box */}
                <div className="border-border text-muted-foreground group-hover:text-foreground relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200">
                  {Icon && <Icon size={18} />}
                </div>

                {/* Label and description */}
                <div className="relative z-10 min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {commonT(`nav.${key}`)}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {t(`explore.${key}`)}
                  </p>
                </div>

                {/* Arrow indicator */}
                <ArrowRight
                  size={16}
                  className="text-muted-foreground relative z-10 shrink-0 -translate-x-3 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100"
                />

                {/* Hover background */}
                <div className="bg-muted absolute -inset-x-1.5 -inset-y-1.5 z-0 scale-95 rounded-xl opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
              </Link>
            )
          })}
        </Suspense>
      </div>
    </div>
  )
}
