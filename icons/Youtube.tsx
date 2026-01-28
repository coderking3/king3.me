'use client'

import type { SvgIcon } from './_internal/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/config'

import { createInteractiveIcon } from './_internal/utils'

interface YoutubeIconProps extends SvgIcon {
  isHovered?: boolean
}
export function YoutubeIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: YoutubeIconProps) {
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
      <g fill="none">
        <path d="M1 11.5c0-3.771 0-5.657 1.172-6.828S5.229 3.5 9 3.5h6c3.771 0 5.657 0 6.828 1.172S23 7.729 23 11.5v1c0 3.771 0 5.657-1.172 6.828S18.771 20.5 15 20.5H9c-3.771 0-5.657 0-6.828-1.172S1 16.271 1 12.5z" />
        <path d="m9.8 15.302l5.701-3.301l-5.7-3.302z" />
        <path
          stroke={color}
          strokeWidth={strokeWidth}
          d="M1 11.5c0-3.771 0-5.657 1.172-6.828S5.229 3.5 9 3.5h6c3.771 0 5.657 0 6.828 1.172S23 7.729 23 11.5v1c0 3.771 0 5.657-1.172 6.828S18.771 20.5 15 20.5H9c-3.771 0-5.657 0-6.828-1.172S1 16.271 1 12.5z"
        />
        <path
          stroke={color}
          strokeWidth={strokeWidth}
          d="m9.8 15.302l5.701-3.301l-5.7-3.302z"
        />
      </g>
    </Svg>
  )
}
export const Youtube = createInteractiveIcon(YoutubeIcon)

const Svg = styled(animated.svg)`
  transform-origin: 50% 85%;
`
