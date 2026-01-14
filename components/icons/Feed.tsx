import type { IconInteractiveProps } from './Interactive'

import type { SvgIcon } from '@/types'

import { animated, useSpring } from '@react-spring/web'

import Interactive from './Interactive'

interface FeedIconProps extends SvgIcon {
  isHovered?: boolean
}

export function FeedIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: FeedIconProps) {
  const circleSpring = useSpring({
    r: isHovered ? 2 : 1,
    config: {
      tension: 300,
      friction: 22
    }
  })

  const i = 2
  const innerRingSpring = useSpring({
    d: isHovered
      ? `M4 ${11 - i} a ${9 + i} ${9 + i} 0 0 1 ${9 + i} ${9 + i}`
      : 'M4 11 a 9 9 0 0 1 9 9',
    config: {
      tension: 300,
      friction: 18
    },
    delay: 16.6 * 4
  })
  const o = 2
  const outerRingSpring = useSpring({
    d: isHovered
      ? `M4 ${4 - o} a ${16 + o} ${16 + o} 0 0 1 ${16 + o} ${16 + o}`
      : 'M4 4 a 16 16 0 0 1 16 16',
    config: {
      tension: 250,
      friction: 12
    },
    delay: 16.6 * 8
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
      aria-hidden="true"
    >
      <animated.path {...innerRingSpring} />
      <animated.path {...outerRingSpring} />
      <animated.circle fill={color} cx="5" cy="19" {...circleSpring} />
    </svg>
  )
}

export function Feed({
  // Icon props
  size,
  color,
  strokeWidth,
  // Interactive props
  ...delegated
}: IconInteractiveProps) {
  return (
    <Interactive {...delegated} trigger="hover">
      {({ isHovered }) => (
        <FeedIcon {...{ size, color, strokeWidth, isHovered }} />
      )}
    </Interactive>
  )
}
