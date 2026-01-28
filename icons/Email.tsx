'use client'

import type { SvgIcon } from './_internal/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/config'

import { createInteractiveIcon } from './_internal/utils'

interface EmailIconProps extends SvgIcon {
  isHovered?: boolean
}
export function EmailIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: EmailIconProps) {
  const svgSpring = useSpring({
    rotate: isHovered ? 5 : 0,
    config: SPRINGS.springy
  })

  return (
    <Svg
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
        <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect width="20" height="16" x="2" y="4" rx="2" />
      </g>
    </Svg>
  )
}

export const Email = createInteractiveIcon(EmailIcon)

const Svg = styled(animated.svg)`
  transform-origin: 50% 85%;
`
