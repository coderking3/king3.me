'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { createInteractiveIcon } from './_internal/utils'

import styles from './Search.module.css'

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
    <span className={styles.searchWrapper}>
      <span className={styles.shimmerWrapper}>
        <animated.span className={styles.shimmer} style={shimmerSpring} />
      </span>
      <animated.svg
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
        style={{
          transformOrigin: `${(11 / 24) * 100}% ${(11 / 24) * 100}%`,
          ...svgSpring
        }}
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </animated.svg>
    </span>
  )
}

export const Search = createInteractiveIcon(SearchIcon)
