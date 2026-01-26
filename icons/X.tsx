'use client'

import type { SvgIcon } from './_internal/types'

import { styled } from '@linaria/react'
import { animated, useSpring } from '@react-spring/web'

import { SPRINGS } from '@/constants'

import { createInteractiveIcon } from './_internal/utils'

interface XIconProps extends SvgIcon {
  isHovered?: boolean
}
export function XIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: XIconProps) {
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
      <path
        fill={color}
        d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
      />
    </Svg>
  )
}

export const X = createInteractiveIcon(XIcon)

const Svg = styled(animated.svg)`
  transform-origin: 50% 85%;
`

// export function RiTwitterXFill(props: SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="1em"
//       height="1em"
//       viewBox="0 0 24 24"
//       {...props}
//     >
//       {/* Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License */}
//       <path
//         fill="currentColor"
//         d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
//       />
//     </svg>
//   )
// }
