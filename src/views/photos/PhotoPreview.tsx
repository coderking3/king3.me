'use client'

import type { Photo } from '@/types'

import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useEffect } from 'react'

import AsyncImage from '@/components/common/AsyncImage'
import { useCopyToClipboard } from '@/hooks'
import { formatLocalDate } from '@/lib/date'

interface PhotoPreviewProps {
  photo: Photo & { originalUrl: string }
  lang: string
  onClose: () => void
}

export default function PhotoPreview({
  photo,
  lang,
  onClose
}: PhotoPreviewProps) {
  const { copied, copy } = useCopyToClipboard(1500)

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
        className="relative max-h-[80dvh] max-w-[90dvw] overflow-hidden rounded-lg"
        style={{
          aspectRatio: `${photo.width} / ${photo.height}`,
          width: `min(${photo.width}px, 90dvw, calc(80dvh * ${photo.width / photo.height}))`,
          height: 'auto'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <AsyncImage
          src={photo.url}
          alt={photo.name}
          fill
          sizes="90dvw"
          preload
          className="rounded-lg object-contain"
        />
      </motion.div>

      {/* Info bar */}
      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 py-2 pr-2 pl-4 backdrop-blur-sm max-md:pr-3 max-md:pl-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Text Info: Row on PC, Column on Mobile (Identical to original) */}
        <div className="flex items-center gap-3 max-md:flex-col max-md:gap-0.5">
          <span className="text-sm font-medium text-white">{photo.name}</span>
          <span className="text-xs text-white/50">
            {photo.width} x {photo.height} &middot;{' '}
            {formatLocalDate(new Date(photo.date), lang)}
          </span>
        </div>

        {/* Copy button: Always on the right */}
        <button
          onClick={() => copy(photo.originalUrl)}
          className="flex shrink-0 items-center justify-center rounded-full p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
          title="Copy image url"
        >
          {copied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </motion.div>
  )
}
