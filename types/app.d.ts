import type { MotionNodeAnimationOptions } from 'framer-motion'

type Animate = MotionNodeAnimationOptions['animate']

interface SvgIcon {
  size?: number | string
  color?: string
  strokeWidth?: number
  className?: string
}

export type { Animate, SvgIcon }
