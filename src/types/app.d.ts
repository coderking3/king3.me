import type { MotionNodeAnimationOptions } from 'framer-motion'

/* Components Types */

type MotionOptions = MotionNodeAnimationOptions

/* MDX Types */

interface PostsMetadata {
  title: string
  description: string
  image: string
  date: string
  tags?: string[]
  published?: boolean
  slug: string
}

interface Posts {
  metadata: PostsMetadata
  content: string
}

export type { MotionOptions, Posts, PostsMetadata }
