import type { IconInteractiveProps } from './Interactive'

import type { MotionOptions, SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import Interactive from './Interactive'

interface GithubIconProps extends SvgIcon {
  isBooped?: boolean
}

export function GithubIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isBooped = false
}: GithubIconProps) {
  const iconMotion: MotionOptions = {
    animate: { rotate: isBooped ? 5 : 0 },
    transition: { type: 'spring', stiffness: 300, damping: 10 }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      strokeWidth={strokeWidth}
      style={{
        originX: 0.5,
        originY: 1
      }}
      {...iconMotion}
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
    </motion.svg>
  )
}

export function Github({
  // Icon props
  size,
  color,
  strokeWidth,
  // Interactive props
  ...restProps
}: IconInteractiveProps) {
  return (
    <Interactive {...restProps} boopOn="hover">
      {({ isHoverBoop }) => (
        <GithubIcon {...{ size, color, strokeWidth, isBooped: isHoverBoop }} />
      )}
    </Interactive>
  )
}
