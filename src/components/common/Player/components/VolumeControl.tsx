'use client'

import { animated, useSpring } from '@react-spring/web'

function VolumeSpringFill({ value }: { value: number }) {
  const spring = useSpring({
    width: value * 100,
    config: { tension: 200, friction: 26 }
  })
  return (
    <animated.div
      className="bg-brand h-full rounded-full"
      style={{ width: spring.width.to((w) => `${w}%`) }}
    />
  )
}

function VolumeSpringThumb({ value }: { value: number }) {
  const spring = useSpring({
    left: value * 100,
    config: { tension: 200, friction: 26 }
  })
  return (
    <animated.div
      className="bg-brand pointer-events-none absolute top-1/2 z-10 size-2.5 -translate-y-1/2 rounded-full opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100"
      style={{ left: spring.left.to((l) => `calc(${l}% - 5px)`) }}
    />
  )
}

export function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute
}: {
  volume: number
  muted: boolean
  onVolumeChange: (v: number) => void
  onToggleMute: () => void
}) {
  const effectiveVol = muted ? 0 : volume

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMute}
        className="text-muted-foreground hover:text-foreground shrink-0 transition"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {effectiveVol === 0 ? (
            <>
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : effectiveVol < 0.5 ? (
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          ) : (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          )}
        </svg>
      </button>

      <div className="group relative flex h-4 w-16 items-center">
        <div className="bg-border h-1 w-full overflow-hidden rounded-full">
          <VolumeSpringFill value={effectiveVol} />
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={effectiveVol}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          aria-label="Volume"
        />
        <VolumeSpringThumb value={effectiveVol} />
      </div>
    </div>
  )
}
