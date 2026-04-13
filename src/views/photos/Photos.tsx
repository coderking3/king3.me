'use client'

import type { Photo } from '@/types'

import { AnimatePresence } from 'framer-motion'
import { Grid2x2, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Animated } from '@/components'
import { cn } from '@/lib/utils'

import PhotoPreview from './PhotoPreview'

export const title = 'Photos'
export const description = 'Moments captured in light — a visual journal.'

function PhotosPage({ photos }: { photos: Photo[] }) {
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
            {title}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {description}
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
              title="Switch view"
              className="text-muted-foreground hover:text-primary rounded-full p-2 transition-colors"
              onClick={() =>
                setView((v) => (v === 'cover' ? 'contain' : 'cover'))
              }
            >
              {isCover ? <Grid2x2 size={20} /> : <LayoutGrid size={20} />}
            </button>
          </Animated>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, i) => (
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
                <Image
                  src={`${photo.url}@600w_1e_0c.webp`}
                  alt={photo.name}
                  fill
                  loading="lazy"
                  className={cn(
                    'transition-transform duration-300 group-hover:scale-105',
                    isCover ? 'object-cover' : 'object-contain'
                  )}
                />
              </Animated>
            ))}
          </div>

          {photos.length === 0 && (
            <Animated preset={{ mode: 'fadeInUp', delay: 0.12 }}>
              <p className="text-muted-foreground py-20 text-center text-sm">
                No photos yet.
              </p>
            </Animated>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <PhotoPreview
            photo={activePhoto}
            onClose={() => setActivePhoto(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotosPage
