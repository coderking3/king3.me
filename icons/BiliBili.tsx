'use client'

import type { SvgIcon } from './_internal/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/config'

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
      // fill={color}
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
        <path d="m7 2l3 3m7-3l-3 3m-5 9v-2m6 0v2" />
      </g>
    </Svg>
  )
}

export const BiliBili = createInteractiveIcon(BiliBiliIcon)

const Svg = styled(animated.svg)`
  transform-origin: 50% 85%;
`
