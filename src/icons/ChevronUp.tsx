import type { InteractiveState, SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { createInteractiveIcon } from './_internal/utils'

interface ChevronUpIconProps extends SvgIcon, Partial<InteractiveState> {}

export function ChevronUpIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false,
  isClicked = false
}: ChevronUpIconProps) {
  const chevronSpring = useSpring({
    translateY: isClicked || isHovered ? -2 : 0,
    config: { tension: 300, friction: 16 }
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="relative block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
    >
      <animated.path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={chevronSpring}
        d="m18 15l-6-6l-6 6"
      />
    </svg>
  )
}

export const ChevronUp = createInteractiveIcon(ChevronUpIcon, [
  'hover',
  'click'
])
