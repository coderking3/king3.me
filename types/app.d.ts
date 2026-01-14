import type { MotionNodeAnimationOptions } from 'framer-motion'

/* Components Types */

type MotionOptions = MotionNodeAnimationOptions

interface SvgIcon {
  size?: number
  color?: string
  strokeWidth?: number
}

/* Other Types */

interface PostFrontmatter {
  title: string
  description: string
  image?: string
  date: string
  tags?: string[]
  lang?: 'zh' | 'en'
  published?: boolean
}

export type { MotionOptions, PostFrontmatter, SvgIcon }
