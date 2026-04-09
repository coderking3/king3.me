'use client'

import type { Photo } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'

interface LightboxProps {
  photos: Photo[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onChange
}: LightboxProps) {
  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  const goPrev = useCallback(() => {
    if (hasPrev) onChange(index - 1)
  }, [hasPrev, index, onChange])

  const goNext = useCallback(() => {
    if (hasNext) onChange(index + 1)
  }, [hasNext, index, onChange])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext])

  if (!photo) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <X size={24} />
        </button>

        {/* Prev button */}
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next button */}
        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            className="relative max-h-[85vh] max-w-[90vw]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.url}
              alt={photo.name}
              width={photo.width}
              height={photo.height}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              priority
            />
            {/* Info bar */}
            <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-linear-to-t from-black/60 to-transparent px-4 py-3">
              <p className="text-sm font-medium text-white">{photo.name}</p>
              <p className="text-xs text-white/60">
                {photo.width} x {photo.height} &middot;{' '}
                {new Date(photo.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          {index + 1} / {photos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
