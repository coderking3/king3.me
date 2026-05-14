'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { createInteractiveIcon } from './_internal/utils'

interface BackIconProps extends SvgIcon {
  isHovered?: boolean
}

const SPRING_CONFIG = {
  tension: 300,
  friction: 16
}

export function BackIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: BackIconProps) {
  // Arrow chevron: M9 14 4 9l5-5 → M6 14 1 9l5-5
  const arrowSpring = useSpring({
    d: isHovered ? 'M6 14 1 9l5-5' : 'M9 14 4 9l5-5',
    config: SPRING_CONFIG
  })

  // Line + curve: start shifts left, h extends to keep arc anchored
  const lineSpring = useSpring({
    d: isHovered
      ? 'M1 9h13.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11'
      : 'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11',
    config: SPRING_CONFIG
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animated.path {...arrowSpring} />
      <animated.path {...lineSpring} />
    </svg>
  )
}

export const Back = createInteractiveIcon(BackIcon)
