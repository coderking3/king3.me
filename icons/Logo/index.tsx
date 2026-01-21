import type { JSX } from 'react'

import type { InteractiveState, SvgIcon } from '../_internal/types'

import type { MotionOptions } from '@/types'

import { motion } from 'framer-motion'

import { createInteractiveIcon } from '../_internal/utils'

import style from './style.module.css'

type LogoVariant = 'regular' | 'bold'

interface LogoProps extends InteractiveState, Omit<SvgIcon, 'strokeWidth'> {
  variant?: LogoVariant
}

const renderRegular = (color: string) => (
  <>
    <path
      strokeWidth={1.5}
      d="M8 12H17"
      stroke={color}
      className={style['divider-line']}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2882 3.25L2.59238 19.6487L2.00836 20.7501H3.25499H3.66804L11.3418 6.27864L12.0044 5.02909L12.667 6.27864L20.3408 20.7501H20.754H22.0006L21.4166 19.6487L12.7208 3.25H11.2882Z"
      fill={color}
      className={style['arrow-up']}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.25499 3.25H3.66807L11.3418 17.7214L12.0044 18.9709L12.667 17.7214L20.3408 3.25H20.754H22.0006L21.4166 4.35136L12.7208 20.75H11.2881L2.59238 4.35136L2.00836 3.25H3.25499Z"
      fill={color}
      className={style['arrow-down']}
    />
  </>
)

const renderBold = (color: string) => (
  <>
    <path
      d="M7.5 12.72H16.5"
      strokeWidth={2}
      stroke={color}
      className={style['divider-line']}
    />

    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.8 3.5H3.5L11.3418 18.5L12.0044 19.8L12.667 18.5L20.509 3.5H21.209H22.6L21.95 4.75L12.85 22H11.159L2.059 4.75L1.409 3.5H2.8Z"
      fill={color}
      className={style['arrow-up']}
    />

    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.159 3.5L2.059 20.75L1.409 22H2.8H3.5L11.3418 7L12.0044 5.7L12.667 7L20.509 22H21.209H22.6L21.95 20.75L12.85 3.5H11.159Z"
      fill={color}
      className={style['arrow-down']}
    />
  </>
)

const SVG_CONTENT_MAP: Record<LogoVariant, (color: string) => JSX.Element> = {
  regular: renderRegular,
  bold: renderBold
}

export function LogoIcon({
  size = 20,
  color = 'currentColor',
  variant = 'regular',
  isHovered = false,
  isClicked = false
  // className
}: LogoProps) {
  const content = SVG_CONTENT_MAP[variant]
  const viewBox = variant === 'regular' ? '0 0 24 24' : '0 0 24 26'

  const iconMotion: MotionOptions = {
    animate: {
      scale: isHovered ? 1.08 : 1,
      scaleX: isClicked ? 0.85 : 1,
      scaleY: isClicked ? 1.08 : 1
    },
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      {...iconMotion}
    >
      {content(color)}
    </motion.svg>
  )
}

export const Logo = createInteractiveIcon(LogoIcon, ['hover', 'click'], {
  exclude: ['strokeWidth']
})

/* 
export function Github({
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
        <GithubIcon {...{ size, color, strokeWidth, isHovered }} />
      )}
    </Interactive>
  )
}

*/
