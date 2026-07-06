import type { Song } from '@/types'

import { motion } from 'framer-motion'
import { Maximize, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import AsyncImage from '../AsyncImage'
import { PlayPauseIcon } from './components/PlayPauseIcon'

const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 32 } as const

interface PlayerMiniProps {
  currentSong: Song
  isPlaying: boolean
  onExpand: () => void
  onPlayPause: () => void
  onClose: () => void
}

export function PlayerMini({
  currentSong,
  isPlaying,
  onExpand,
  onPlayPause,
  onClose
}: PlayerMiniProps) {
  const authorLabel = Array.isArray(currentSong.author)
    ? currentSong.author.join(' / ')
    : currentSong.author

  return (
    <div className="border-border bg-background/90 flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-md">
      {/* Song */}
      <span
        className="group flex cursor-pointer items-center gap-2"
        onClick={onExpand}
      >
        {/* Cover */}
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
          <AsyncImage
            src={currentSong.cover}
            alt={currentSong.name}
            width={32}
            height={32}
            className={cn(
              'size-full object-cover',
              isPlaying && 'animation-duration-[8s] animate-spin'
            )}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

          {/* Expand icon */}
          <div className="absolute inset-0 flex scale-75 items-center justify-center text-white opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
            <Maximize size={14} strokeWidth={3} />
          </div>
        </div>

        {/* Track info */}
        <div className="max-w-[120px]">
          <p className="truncate text-xs leading-none font-medium">
            {currentSong.name}
          </p>
          <p className="text-muted-foreground mt-1 truncate text-[10px] leading-none">
            {authorLabel}
          </p>
        </div>
      </span>

      {/* Play/pause */}
      <motion.button
        onClick={onPlayPause}
        className="bg-brand text-brand-foreground flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        whileTap={{ scale: 0.88 }}
        transition={SPRING_SNAPPY}
      >
        <PlayPauseIcon isPlaying={isPlaying} size={13} />
      </motion.button>

      {/* Close */}
      <motion.button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground mr-0.5 shrink-0 transition"
        aria-label="Close"
        whileTap={{ scale: 0.88 }}
      >
        <X size={15} strokeWidth={3} />
      </motion.button>
    </div>
  )
}
