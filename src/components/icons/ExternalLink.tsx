'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/constants'
import { cn } from '@/lib/utils'

interface ExternalLinkIconProps extends SvgIcon {
  isHovered?: boolean
  colors?: {
    arrow?: string
    body?: string
  }
}

export function ExternalLinkIcon({
  size = 20,
  color,
  colors,
  strokeWidth = 2,
  isHovered = false,
  className
}: ExternalLinkIconProps & { className?: string }) {
  const arrowColor = color ?? colors?.arrow ?? 'currentColor'
  const bodyColor = color ?? colors?.body ?? 'currentColor'

  const arrowSpring = useSpring({
    x: isHovered ? 23 : 21,
    y: isHovered ? 1 : 3,
    config: SPRINGS.springy
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn('block overflow-visible', className)}
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animated.path
        stroke={arrowColor}
        d={arrowSpring.x.to((x) => `M${x - 6} ${arrowSpring.y.get()}h6v6`)}
      />
      <animated.path
        stroke={arrowColor}
        d={arrowSpring.x.to((x) => `M10 14L${x} ${arrowSpring.y.get()}`)}
      />
      <path
        stroke={bodyColor}
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      />
    </svg>
  )
}
