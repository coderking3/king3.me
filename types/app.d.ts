import type { MotionNodeAnimationOptions } from 'framer-motion'

/* Components Types */

type MotionOptions = MotionNodeAnimationOptions

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

export type { MotionOptions, PostFrontmatter }
