'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/constants'

import { createInteractiveIcon } from './_internal/utils'

interface BiliBiliIconProps extends SvgIcon {
  isHovered?: boolean
}

export function BiliBiliIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: BiliBiliIconProps) {
  const svgSpring = useSpring({
    scale: isHovered ? 0.95 : 1,
    config: SPRINGS.springy
  })
  const antennaSpring = useSpring({
    y1: isHovered ? 5 : 2,
    config: SPRINGS.springy
  })
  const eyeSpring = useSpring({
    opacity: isHovered ? 0 : 1,
    config: SPRINGS.springy
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
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      >
        <rect width="20" height="16" x="2" y="5" rx="4" />
        {/* Antennas */}
        <animated.line x1="7" y2="5" x2="10" {...antennaSpring} />
        <animated.line x1="17" y2="5" x2="14" {...antennaSpring} />
        {/* Eyes */}
        <animated.path d="M9 14v-2m6 0v2" style={eyeSpring} />
      </g>
    </animated.svg>
  )
}

export const BiliBili = createInteractiveIcon(BiliBiliIcon)
