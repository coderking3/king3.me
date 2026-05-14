'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

/* --- Split paths from Lucide "Languages" icon --- */

// Left side: Chinese/translation symbol (center x ≈ 8)
const ZH_PATH = 'M5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1'
// Right side: letter A (center x ≈ 17)
const EN_PATH = 'M22 22l-5-10l-5 10m2-4h6'

// Distance between centers for position swap
const SWAP_OFFSET = 9
// Vertical arc height during swap (one goes up, one goes down)
const ARC_HEIGHT = 3

interface LanguageIconProps extends SvgIcon {
  isEN?: boolean
  isHovered?: boolean
}

export function LanguageIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isEN = true,
  isHovered = false
}: LanguageIconProps) {
  const config = {
    tension: 300,
    friction: 16
  }

  const svgSpring = useSpring({
    scale: isHovered ? 1.05 : 1,
    config
  })

  const { progress } = useSpring({
    progress: isEN ? 0 : 1,
    config
  })

  const strokeProps = {
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth
  }

  // Arc: sin(π·t) peaks at t=0.5, creating a smooth curve during the swap
  const zhTransform = progress.to((t) => {
    const x = t * SWAP_OFFSET
    const y = -Math.sin(t * Math.PI) * ARC_HEIGHT
    return `translate(${x}, ${y})`
  })

  const enTransform = progress.to((t) => {
    const x = -t * SWAP_OFFSET
    const y = Math.sin(t * Math.PI) * ARC_HEIGHT
    return `translate(${x}, ${y})`
  })

  return (
    <animated.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      style={svgSpring}
    >
      {/* Chinese symbol — arcs up-right when isEN */}
      <animated.g transform={zhTransform}>
        <path d={ZH_PATH} {...strokeProps} />
      </animated.g>

      {/* Letter A — arcs down-left when isEN */}
      <animated.g transform={enTransform}>
        <path d={EN_PATH} {...strokeProps} />
      </animated.g>
    </animated.svg>
  )
}
