'use client'

import type { SvgIcon } from './_internal/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { createInteractiveIcon } from './_internal/utils'

interface GithubIconProps extends SvgIcon {
  isHovered?: boolean
}

export function SearchIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: GithubIconProps) {
  const svgSpring = useSpring({
    transform: isHovered ? 'scale(1.1) rotate(8deg)' : 'scale(1) rotate(0deg)',
    config: {
      tension: 300,
      friction: 10
    }
  })
  const shimmerSpring = useSpring({
    transform: isHovered
      ? 'rotate(-20deg) translateX(-40%)'
      : 'rotate(-20deg) translateX(50%)',
    config: {
      tension: 300,
      friction: 12
    }
  })

  return (
    <Wrapper>
      <ShimmerWrapper>
        <Shimmer style={shimmerSpring} />
      </ShimmerWrapper>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="block overflow-visible"
        width={`${size / 16}rem`}
        height={`${size / 16}rem`}
        fill="none"
        aria-hidden="true"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={svgSpring}
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </Svg>
    </Wrapper>
  )
}

export const Search = createInteractiveIcon(SearchIcon)

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  transition:
    transform 300ms cubic-bezier(0.06, 0.63, 0.43, 1),
    opacity 300ms;
`

const ShimmerWrapper = styled.span`
  position: absolute;
  width: 50%;
  height: 45%;
  top: 23%;
  right: 30%;
  border-radius: 50%;
  overflow: hidden;
  overflow: clip;
  transform: scale(0.85) rotate(-20deg);
  transform-origin: center center;
  transition: opacity 500ms;
  transition-delay: 400ms;

  html.light & {
    opacity: 0;
    transition: opacity 0ms;
    transition-delay: 0ms;
  }
`

const Shimmer = styled(animated.span)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.5;
  animation: shimmer 400ms both;
  border-radius: 50%;

  html.light & {
    background: transparent;
    opacity: 1;
  }
`

const Svg = styled(animated.svg)`
  transform-origin: ${(11 / 24) * 100}% ${(11 / 24) * 100}%;
`
