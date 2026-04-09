'use client'

import type { Photo } from '@/types'

import Image from 'next/image'
import { useState } from 'react'

import { Animated } from '@/components'

import Lightbox from './Lightbox'

export const title = 'Photos'
export const description = 'Moments captured in light — a visual journal.'

function PhotosPage({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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

        <div className="mt-12 sm:mt-20">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, i) => (
              <Animated
                key={photo.id}
                preset={{ mode: 'fadeInUp', delay: 0.12 + i * 0.04 }}
              >
                <button
                  type="button"
                  className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg"
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image
                    src={`${photo.url}@600w_1e_1c.webp`}
                    alt={photo.name}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </button>
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

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  )
}

export default PhotosPage
