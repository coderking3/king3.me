import type { MotionOptions } from '@/types'

import { AnimatePresence } from 'framer-motion'
import { Pause, Play } from 'lucide-react'

import { Animated } from '@/components/common'

export function PlayPauseIcon({
  isPlaying,
  size = 16
}: {
  isPlaying: boolean
  size?: number
}) {
  const animation: MotionOptions = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
    transition: { duration: 0.12 }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Animated
        as="span"
        key={isPlaying ? 'pause' : 'play'}
        className="flex"
        animation={animation}
      >
        {isPlaying ? (
          <Pause fill="currentColor" strokeWidth={0} size={size} />
        ) : (
          <Play fill="currentColor" strokeWidth={0} size={size} />
        )}
      </Animated>
    </AnimatePresence>
  )
}
