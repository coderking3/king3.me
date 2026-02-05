/* eslint-disable react/no-array-index-key */
'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

interface GalleryProps {
  images: string[]
}

function Gallery({ images }: GalleryProps) {
  const { theme } = useTheme()
  const [width, setWidth] = React.useState(0)
  const [isCompact, setIsCompact] = React.useState(false)
  const expandedWidth = React.useMemo(() => width * 1.38, [width])

  React.useEffect(() => {
    const handleResize = () => {
      // 640px is the breakpoint for md
      if (window.innerWidth < 640) {
        setIsCompact(true)
        return setWidth(window.innerWidth / 2 - 64)
      }

      setWidth(window.innerWidth / images.length - 4 * images.length)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [images.length])

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, scale: 0.925, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.5,
        type: 'spring'
      }}
    >
      <div className="-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0">
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            className="relative h-35 flex-none shrink-0 snap-start overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-lime-800/20 md:h-72 md:rounded-3xl dark:bg-zinc-800 dark:ring-lime-300/10"
            animate={{
              width,
              opacity: isCompact ? 1 : 0.85,
              filter: isCompact
                ? 'grayscale(0)'
                : `grayscale(${theme === 'dark' ? 0.35 : 0.1})`,
              rotate: idx % 2 === 0 ? 2 : -1
            }}
            whileHover={
              isCompact
                ? {}
                : {
                    width: expandedWidth,
                    opacity: 1,
                    filter: 'grayscale(0)'
                  }
            }
            layout
          >
            <Image
              src={image}
              alt=""
              width={500}
              height={300}
              sizes="(min-width: 640px) 18rem, 11rem"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
              priority
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Gallery
