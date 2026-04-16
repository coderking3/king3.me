'use client'

import type { Photo } from '@/types'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Spinner } from '@/components/ui/spinner'

interface PhotoPreviewProps {
  photo: Photo
  lang: string
  onClose: () => void
}

export default function PhotoPreview({
  photo,
  lang,
  onClose
}: PhotoPreviewProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Image */}
      <motion.div
        className="relative overflow-hidden rounded-lg"
        style={{
          width: '90dvw',
          maxHeight: '80dvh',
          aspectRatio: `${photo.width} / ${photo.height}`
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Spinner className="size-8 text-white/50" />
          </div>
        )}
        <Image
          src={photo.url}
          alt={photo.name}
          fill
          sizes="90dvw"
          priority
          onLoad={() => setLoaded(true)}
          className="rounded-lg object-contain"
        />
      </motion.div>

      {/* Info bar */}
      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium text-white">{photo.name}</span>
        <span className="text-xs text-white/50">
          {photo.width} x {photo.height} &middot;{' '}
          {new Date(photo.date).toLocaleDateString(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
    </motion.div>
  )
}
