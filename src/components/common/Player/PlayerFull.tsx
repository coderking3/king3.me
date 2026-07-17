import type { Easing } from 'framer-motion'

import type { PlayMode } from './components/PlayModeButton'

import type { Song } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'
import { ListMusic, Minimize, SkipBack, SkipForward } from 'lucide-react'

import { cn } from '@/lib/utils'

import { BarVisualizer } from './components/BarVisualizer'
import { CoverSpinner } from './components/CoverSpinner'
import { PlaylistPanel } from './components/PlaylistPanel'
import { PlayModeButton } from './components/PlayModeButton'
import { PlayPauseIcon } from './components/PlayPauseIcon'
import { ProgressBar } from './components/ProgressBar'
import { VolumeControl } from './components/VolumeControl'

export type { PlayMode }
export type Direction = 1 | -1 | 0

// ─── Track slide variants ─────────────────────────────────────────────────────

const trackVariants = {
  enter: (dir: Direction) => ({
    x: dir === 0 ? 0 : dir > 0 ? 28 : -28,
    opacity: 0
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: Direction) => ({
    x: dir === 0 ? 0 : dir > 0 ? -28 : 28,
    opacity: 0
  })
}

const trackTransition: { duration: number; ease: Easing } = {
  duration: 0.2,
  ease: [0.32, 0.72, 0, 1]
}

const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 32 } as const

interface PlayerFullProps {
  currentSong: Song
  queue: Song[]
  currentIndex: number
  isPlaying: boolean
  progress: number
  duration: number
  volume: number
  muted: boolean
  mode: PlayMode
  slideDir: Direction
  showPlaylist: boolean
  onMinimize: () => void
  onPlayPause: () => void
  onPrev: () => void
  onNext: () => void
  onSeek: (r: number) => void
  onVolumeChange: (v: number) => void
  onToggleMute: () => void
  onCycleMode: () => void
  onTogglePlaylist: () => void
  onSelectTrack: (idx: number) => void
}

export function PlayerFull({
  currentSong,
  queue,
  currentIndex,
  isPlaying,
  progress,
  duration,
  volume,
  muted,
  mode,
  slideDir,
  showPlaylist,
  onMinimize,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onCycleMode,
  onTogglePlaylist,
  onSelectTrack
}: PlayerFullProps) {
  const authorLabel = Array.isArray(currentSong.author)
    ? currentSong.author.join(' / ')
    : currentSong.author

  return (
    <div className="border-border bg-background/90 w-[20rem] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-muted-foreground text-[11px] tracking-wider uppercase">
          Now playing
        </span>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onTogglePlaylist}
            className={cn(
              'transition',
              showPlaylist
                ? 'text-brand'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Playlist"
            whileTap={{ scale: 0.88 }}
          >
            <ListMusic size={15} strokeWidth={2.5} />
          </motion.button>
          <motion.button
            onClick={onMinimize}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Minimize"
            whileTap={{ scale: 0.88 }}
          >
            <Minimize size={15} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Playlist — no AnimatePresence, direct conditional render */}
      {showPlaylist && (
        <PlaylistPanel
          songs={queue}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onSelect={onSelectTrack}
        />
      )}

      {/* Cover + info — only shown when playlist is hidden */}
      {!showPlaylist && (
        // Fixed height container clips the exit animation so it never
        // pushes progress bar or controls during the slide transition
        <div className="relative h-20 overflow-hidden">
          <AnimatePresence custom={slideDir} initial={false}>
            <motion.div
              key={currentSong.id}
              custom={slideDir}
              variants={trackVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={trackTransition}
              // absolute so entering and exiting tracks overlap during transition
              className="absolute inset-0 flex items-center gap-2.5 px-4"
            >
              {/* Cover slides together with text info */}
              <div className="ring-border ring-offset-background mx-1.5 size-[3.5rem] shrink-0 overflow-hidden rounded-full shadow-lg ring-2 ring-offset-2">
                <CoverSpinner
                  src={currentSong.cover}
                  alt={currentSong.name}
                  isPlaying={isPlaying}
                />
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">
                  {currentSong.name}
                </p>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                  {authorLabel}
                </p>
              </div>

              {/* Bar visualizer */}
              <BarVisualizer playing={isPlaying} className="shrink-0" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Progress */}
      <div className="px-4 pb-2">
        <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 pb-3">
        <PlayModeButton mode={mode} onCycle={onCycleMode} />

        <div className="flex items-center gap-3">
          <motion.button
            onClick={onPrev}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Previous"
            whileTap={{ scale: 0.82, x: -2 }}
            transition={SPRING_SNAPPY}
          >
            <SkipBack size={18} />
          </motion.button>

          <motion.button
            onClick={onPlayPause}
            className="bg-brand text-brand-foreground flex size-9 items-center justify-center rounded-full shadow-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
            transition={SPRING_SNAPPY}
          >
            <PlayPauseIcon isPlaying={isPlaying} size={16} />
          </motion.button>

          <motion.button
            onClick={onNext}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Next"
            whileTap={{ scale: 0.82, x: 2 }}
            transition={SPRING_SNAPPY}
          >
            <SkipForward size={18} />
          </motion.button>
        </div>

        <VolumeControl
          volume={volume}
          muted={muted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>
    </div>
  )
}
