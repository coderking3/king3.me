'use client'

import type { SvgIcon } from './_internal/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/constants'

import { createInteractiveIcon } from './_internal/utils'

interface GithubIconProps extends SvgIcon {
  isHovered?: boolean
}

export function GithubIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: GithubIconProps) {
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
      strokeWidth={strokeWidth}
      style={svgSpring}
    >
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </g>
    </Svg>
  )
}

export function GithubCircleIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: GithubIconProps) {
  const svgSpring = useSpring({
    rotate: isHovered ? 5 : 0,
    config: SPRINGS.springy
  })

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      strokeWidth={strokeWidth}
      style={svgSpring}
    >
      <path
        fill={color}
        d="M32 0C14 0 0 14 0 32c0 21 19 30 22 30c2 0 2-1 2-2v-5c-7 2-10-2-11-5c0 0 0-1-2-3c-1-1-5-3-1-3c3 0 5 4 5 4c3 4 7 3 9 2c0-2 2-4 2-4c-8-1-14-4-14-15q0-6 3-9s-2-4 0-9c0 0 5 0 9 4c3-2 13-2 16 0c4-4 9-4 9-4c2 7 0 9 0 9q3 3 3 9c0 11-7 14-14 15c1 1 2 3 2 6v8c0 1 0 2 2 2c3 0 22-9 22-30C64 14 50 0 32 0"
      />
    </Svg>
  )
}

export const Github = createInteractiveIcon(GithubIcon)
export const GithubCircle = createInteractiveIcon(GithubCircleIcon)

const Svg = styled(animated.svg)`
  transform-origin: 50% 85%;
`
