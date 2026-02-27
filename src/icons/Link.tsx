'use client'

import type { SvgIcon } from './_internal/types'

import { animated, useSpring } from '@react-spring/web'

import { createInteractiveIcon } from './_internal/utils'

interface LinkIconProps extends SvgIcon {
  isHovered?: boolean
}

const SPRING_CONFIG = { tension: 300, friction: 16 }

// 平移量（SVG 坐标单位）
const OFFSET = 1.2
// 直线缩短比例，1 = 原长，0.3 = 缩至 30%
const LINE_SCALE_MIN = 0.3

// path1 末尾直线原始向量
const L1 = { x: -1.72, y: 1.71 }
// path2 末尾直线原始向量
const L2 = { x: 1.71, y: -1.71 }

export function LinkIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHovered = false
}: LinkIconProps) {
  const { t } = useSpring({
    t: isHovered ? 1 : 0,
    config: SPRING_CONFIG
  })

  // path1：右上环，靠拢时左下平移 + 末尾直线缩短
  const path1D = t.to((v) => {
    const scale = 1 - (1 - LINE_SCALE_MIN) * v
    const lx = (L1.x * scale).toFixed(3)
    const ly = (L1.y * scale).toFixed(3)
    return `M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l${lx} ${ly}`
  })

  // path2：左下环，靠拢时右上平移 + 末尾直线缩短
  const path2D = t.to((v) => {
    const scale = 1 - (1 - LINE_SCALE_MIN) * v
    const lx = (L2.x * scale).toFixed(3)
    const ly = (L2.y * scale).toFixed(3)
    return `M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l${lx} ${ly}`
  })

  const path1Transform = t.to(
    (v) => `translate(${-OFFSET * v}px, ${OFFSET * v}px)`
  )
  const path2Transform = t.to(
    (v) => `translate(${OFFSET * v}px, ${-OFFSET * v}px)`
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      fill="none"
    >
      <g
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      >
        <animated.path d={path1D} style={{ transform: path1Transform }} />
        <animated.path d={path2D} style={{ transform: path2Transform }} />
      </g>
    </svg>
  )
}

export const Link = createInteractiveIcon(LinkIcon)
