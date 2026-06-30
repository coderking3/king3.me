'use client'

import { animated, useSpring } from '@react-spring/web'

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ProgressBar({
  progress,
  duration,
  onSeek
}: {
  progress: number
  duration: number
  onSeek: (r: number) => void
}) {
  const pct = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress * 100))
    : 0

  const spring = useSpring({
    pct,
    config: { tension: 200, friction: 26 }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) // 0 - 100
    onSeek(value / 100)
  }

  return (
    <div className="group flex items-center gap-2">
      <span className="text-muted-foreground w-8 shrink-0 text-right text-xs tabular-nums">
        {formatTime(progress * duration)}
      </span>

      <div className="relative flex-1">
        {/* track */}
        <div className="bg-border h-1 w-full overflow-hidden rounded-full">
          <animated.div
            className="bg-brand h-full rounded-full"
            style={{ width: spring.pct.to((p) => `${p}%`) }}
          />
        </div>

        {/* thumb */}
        <animated.div
          className="bg-brand pointer-events-none absolute top-1/2 z-10 size-3 -translate-y-1/2 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100"
          style={{
            left: spring.pct.to((p) => `calc(${p}% - 6px)`)
          }}
        />

        {/* interaction layer */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={pct}
          onChange={handleChange}
          className="absolute inset-0 h-1 w-full cursor-pointer opacity-0"
          aria-label="Playback progress"
        />
      </div>

      <span className="text-muted-foreground w-8 shrink-0 text-xs tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  )
}
