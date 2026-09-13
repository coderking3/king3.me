'use client'

import type { GalleryItem } from '@/types'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import * as React from 'react'

import AsyncImage from '@/components/common/AsyncImage'
import { usePageEntrance } from '@/hooks/usePageEntrance'
import { cn } from '@/lib/utils'

import styles from './Gallery.module.css'

interface GalleryProps {
  images: GalleryItem[]
}

function Gallery({ images }: GalleryProps) {
  const { theme } = useTheme()
  const { entranceKey, shouldAnimateOnMount } = usePageEntrance()
  const [layout, setLayout] = React.useState<{
    width: number
    expandedWidth: number
    isCompact: boolean
  }>()

  const galleryStyle = {
    '--gallery-card-width-wide': `calc(${100 / images.length}vw - ${4 * images.length}px)`
  } as React.CSSProperties

  React.useEffect(() => {
    const handleResize = () => {
      // Match the compact interaction breakpoint used by the CSS layout.
      if (window.innerWidth < 640) {
        const width = window.innerWidth / 2 - 64

        return setLayout({ width, expandedWidth: width, isCompact: true })
      }

      const width = window.innerWidth / images.length - 4 * images.length

      setLayout({ width, expandedWidth: width * 1.38, isCompact: false })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [images.length])

  return (
    <motion.div
      key={entranceKey}
      className="mt-12"
      initial={
        shouldAnimateOnMount ? { opacity: 0, scale: 0.925, y: 12 } : false
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.22,
        type: 'spring',
        stiffness: 260,
        damping: 25
      }}
    >
      <div
        className={cn(
          styles.track,
          '-my-4 flex w-full snap-x snap-proximity scroll-pl-4 scrollbar-none justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0'
        )}
        style={galleryStyle}
      >
        {images.map(({ url, name }, idx) => (
          <motion.div
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className={cn(
              styles.card,
              'relative h-35 flex-none shrink-0 snap-start md:h-72'
            )}
            initial={
              shouldAnimateOnMount
                ? {
                    width: 0,
                    opacity: 1,
                    filter: 'grayscale(0)'
                  }
                : false
            }
            animate={
              shouldAnimateOnMount && layout
                ? {
                    width: layout.width,
                    opacity: layout.isCompact ? 1 : 0.85,
                    filter: layout.isCompact
                      ? 'grayscale(0)'
                      : `grayscale(${theme === 'dark' ? 0.35 : 0.1})`
                  }
                : undefined
            }
            whileHover={
              !layout || layout.isCompact
                ? {}
                : {
                    width: layout.expandedWidth,
                    opacity: 1,
                    filter: 'grayscale(0)'
                  }
            }
            layout
          >
            <motion.div
              className={cn(
                styles.cardVisual,
                idx % 2 === 0 ? styles.clockwise : styles.counterClockwise,
                'ring-border bg-muted relative h-full w-full overflow-hidden rounded-xl ring-2 md:rounded-3xl'
              )}
              initial={shouldAnimateOnMount ? { rotate: 0 } : false}
              animate={
                shouldAnimateOnMount
                  ? { rotate: idx % 2 === 0 ? 2 : -1 }
                  : undefined
              }
            >
              <AsyncImage
                src={url}
                alt={name}
                width={500}
                height={300}
                loading="eager"
                sizes="(min-width: 640px) 18rem, 11rem"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
                wrapper={false}
                preload
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Gallery
