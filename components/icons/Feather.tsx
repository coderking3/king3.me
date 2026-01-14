import type { IconInteractiveProps } from './Interactive'

import type { SvgIcon } from '@/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/constants'

import Interactive from './Interactive'

interface GithubIconProps extends SvgIcon {
  isHovered?: boolean
}

export function FeatherIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: GithubIconProps) {
  const svgSpring = useSpring({
    // rotate: isHovered ? 5 : 0,

    // 在 X 和 Y 轴上产生微小的不对称位移
    to: isHovered
      ? [
          { transform: 'translate(2px, -1px)' },
          { transform: 'translate(-1px, 1px)' },
          { transform: 'translate(0px, 0px)' }
        ]
      : { transform: 'translate(0px, 0px)' },

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
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1zM16 8L2 22m15.5-7H9"
      />
    </Svg>
  )
}

export function Feather({
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
        <FeatherIcon {...{ size, color, strokeWidth, isHovered }} />
      )}
    </Interactive>
  )
}

const Svg = styled(animated.svg)`
  transform-origin: 50% 85%;
`
