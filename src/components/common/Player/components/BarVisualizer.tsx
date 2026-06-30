'use client'

import { animated, useSpring } from '@react-spring/web'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

type BarVisualizerSize = 'sm' | 'lg'

interface BarConfig {
  min: number
  max: number
  duration: number
}

interface SizeVariant {
  bars: BarConfig[]
  restScale: number
  barWidth: string
  containerClassName: string
}

// Each bar has its own amplitude range + cycle duration so they bounce
// out of sync — that desync is what makes it read as "alive" rather
// than a mechanical blink.
const VARIANTS: Record<BarVisualizerSize, SizeVariant> = {
  // Compact, inline — for tight spaces like a playlist row.
  sm: {
    bars: [
      { min: 0.3, max: 0.75, duration: 420 },
      { min: 0.35, max: 1, duration: 520 },
      { min: 0.3, max: 0.85, duration: 380 }
    ],
    restScale: 0.4,
    barWidth: 'w-[2.5px]',
    containerClassName: 'h-2.5 gap-[2px]'
  },
  // Larger, pill-shelled — for the now-playing card.
  lg: {
    bars: [
      { min: 0.3, max: 0.6, duration: 450 },
      { min: 0.35, max: 1, duration: 550 },
      { min: 0.35, max: 0.85, duration: 400 },
      { min: 0.35, max: 1, duration: 600 },
      { min: 0.3, max: 0.65, duration: 500 }
    ],
    restScale: 0.55,
    barWidth: 'w-1',
    containerClassName: 'bg-muted/40 h-9 gap-[3px] rounded-full px-2.5 py-2'
  }
}

function Bar({
  min,
  max,
  duration,
  barWidth,
  playing
}: BarConfig & { barWidth: string; playing: boolean }) {
  // Lets the async loop below see the latest playing value without
  // having to restart the loop on every render.
  const playingRef = useRef(playing)
  playingRef.current = playing

  const [{ scale }, api] = useSpring(() => ({ scale: min }))

  useEffect(() => {
    if (playing) {
      api.start({
        to: async (next) => {
          while (playingRef.current) {
            await next({ scale: max, config: { duration } })
            if (!playingRef.current) break
            await next({ scale: min, config: { duration } })
          }
        }
      })
    } else {
      // Spring smoothly tweens from whatever the current value is —
      // no snap, regardless of where the loop was interrupted.
      api.start({
        scale: min,
        config: { tension: 170, friction: 24 }
      })
    }
  }, [playing, api, min, max, duration])

  return (
    <animated.span
      aria-hidden
      className={cn('bg-brand h-full origin-bottom rounded-full', barWidth)}
      style={{
        transform: scale.to((s) => `scaleY(${s})`),
        opacity: playing ? 1 : 0.5
      }}
    />
  )
}

export function BarVisualizer({
  playing,
  size = 'lg',
  className
}: {
  playing: boolean
  size?: BarVisualizerSize
  className?: string
}) {
  const variant = VARIANTS[size]

  return (
    <span
      className={cn('flex items-end', variant.containerClassName, className)}
    >
      {variant.bars.map((bar, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Bar key={i} {...bar} barWidth={variant.barWidth} playing={playing} />
      ))}
    </span>
  )
}
