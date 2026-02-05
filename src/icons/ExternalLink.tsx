'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/constants'

interface ExternalLinkIconProps extends SvgIcon {
  isHovered?: boolean
}

export function ExternalLinkIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: ExternalLinkIconProps) {
  const arrowSpring = useSpring({
    x: isHovered ? 23 : 21,
    y: isHovered ? 1 : 3,
    config: SPRINGS.springy
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
      <animated.path
        d={arrowSpring.x.to((x) => `M${x - 6} ${arrowSpring.y.get()}h6v6`)}
      />
      <animated.path
        d={arrowSpring.x.to((x) => `M10 14L${x} ${arrowSpring.y.get()}`)}
      />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}
