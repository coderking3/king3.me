'use client'

import type { Photo } from '@/types'

import { AnimatePresence } from 'framer-motion'
import { Grid2x2, LayoutGrid } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { Animated, AsyncImage } from '@/components/common'
import { getRemoteImageUrl } from '@/lib/image'
import { cn } from '@/lib/utils'

import PhotoPreview from './PhotoPreview'

function PhotosPage({ photos }: { photos: Photo[] }) {
  const t = useTranslations('page.photos')
  const locale = useLocale()
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)
  const [view, setView] = useState<'cover' | 'contain'>('cover')
  const isCover = view === 'cover'

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {t('title')}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {t('description')}
          </Animated>
        </header>

        <div className="relative mt-16 sm:mt-20">
          {/* View toggle — top-left of image list, sticky + no layout space */}
          <Animated
            preset={{ mode: 'fadeInUp', delay: 0.1 }}
            className="sticky top-32 z-10 h-0 -translate-y-12"
          >
            <button
              type="button"
              title={t('switchView')}
              className="text-muted-foreground hover:text-primary rounded-full p-2 transition-colors"
              onClick={() =>
                setView((v) => (v === 'cover' ? 'contain' : 'cover'))
              }
            >
              {isCover ? <Grid2x2 size={20} /> : <LayoutGrid size={20} />}
            </button>
          </Animated>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, i) => {
              const url = getRemoteImageUrl(photo.url, {
                bilibili: { format: 'webp' }
              })
              return (
                <Animated
                  key={photo.id}
                  preset={{
                    mode: 'fadeInUp',
                    delay: Math.min(0.12 + i * 0.04, 0.56)
                  }}
                  className={cn(
                    'group relative aspect-square cursor-zoom-in overflow-hidden',
                    isCover && 'rounded-lg'
                  )}
                  onClick={() => setActivePhoto(photo)}
                >
                  <AsyncImage
                    src={url}
                    alt={photo.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1280px) 16.5rem, (min-width: 1152px) 22rem, (min-width: 1024px) calc(33vw - 2rem), (min-width: 768px) calc(50vw - 2.5rem), 100vw"
                    className={cn(
                      'transition-[opacity,transform,translate,scale,rotate] group-hover:scale-105',
                      isCover ? 'object-cover' : 'object-contain'
                    )}
                  />
                </Animated>
              )
            })}
          </div>

          {photos.length === 0 && (
            <Animated preset={{ mode: 'fadeInUp', delay: 0.12 }}>
              <p className="text-muted-foreground py-20 text-center text-sm">
                {t('noPhotos')}
              </p>
            </Animated>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <PhotoPreview
            key={activePhoto.id}
            photo={activePhoto}
            lang={locale}
            onClose={() => setActivePhoto(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotosPage
