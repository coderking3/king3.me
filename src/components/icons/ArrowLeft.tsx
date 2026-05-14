'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { createInteractiveIcon } from './_internal/utils'

interface ArrowLeftIconProps extends SvgIcon {
  isHovered?: boolean
}

const SPRING_CONFIG = {
  tension: 300,
  friction: 16
}

export function ArrowLeftIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: ArrowLeftIconProps) {
  // Line left end extends: 6 → 3
  const lineSpring = useSpring({
    x1: isHovered ? 3 : 6,
    config: SPRING_CONFIG
  })

  // Arrow head shifts left by 3px
  const polylineSpring = useSpring({
    points: isHovered ? '9 5 2 12 9 19' : '12 5 5 12 12 19',
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
      <animated.line x2={19} y1={12} y2={12} {...lineSpring} />
      <animated.polyline {...polylineSpring} />
    </svg>
  )
}

export const ArrowLeft = createInteractiveIcon(ArrowLeftIcon)
