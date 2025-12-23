import type { SvgIcon } from '@/types'

import React from 'react'

import { cn } from '@/lib/utils'

interface ThemeToggleProps extends SvgIcon {
  className?: string
}

function ThemeToggle({
  size = '1.25rem',
  color = 'currentColor',
  strokeWidth = 1.5,
  className
}: ThemeToggleProps) {
  // 避免多实例时 mask id 冲突
  const uid = React.useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: 'rotate(40deg)' }}
      className={cn(className)}
    >
      {/* ---------- Masks ---------- */}
      <mask id={`sun-dot-mask-${uid}`}>
        <rect x="-10" y="-10" width="44" height="44" fill="#fff" />
        <circle r="6" cx="12" cy="12" fill="#000" />
      </mask>

      <mask id={`moon-cutout-mask-${uid}`}>
        <rect x="0" y="0" width="24" height="24" fill="#fff" />
        <circle cx="12" cy="4" r="8" fill="#000" />
      </mask>

      <mask id={`moon-crescent-mask-${uid}`}>
        <rect x="0" y="0" width="24" height="24" fill="#000" />
        <circle r="10.5" cx="12" cy="12" fill="#fff" />
      </mask>

      {/* ---------- Sun Dots ---------- */}
      <g mask={`url(#sun-dot-mask-${uid})`} fill={color}>
        {[
          [22, 12, 480],
          [19.0711, 19.0711, 400],
          [12, 22, 320],
          [4.9289, 19.0711, 240],
          [2, 12, 200],
          [4.9289, 4.9289, 280],
          [12, 2, 360],
          [19.0711, 4.9289, 440]
        ].map(([cx, cy, delay], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.5"
            style={{
              transformOrigin: 'center',
              transform: 'scale(0)',
              ['--enter-animation-delay' as any]: `${delay}ms`
            }}
          />
        ))}
      </g>

      {/* ---------- Moon Ring ---------- */}
      <g mask={`url(#moon-cutout-mask-${uid})`}>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </g>

      {/* ---------- Crescent ---------- */}
      <g mask={`url(#moon-crescent-mask-${uid})`}>
        <circle
          cx="12"
          cy="4"
          r="8"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </g>
    </svg>
  )
}

export default ThemeToggle
