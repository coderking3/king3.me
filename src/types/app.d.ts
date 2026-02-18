import type { MotionNodeAnimationOptions } from 'framer-motion'

interface AuthorInfo {
  name: string
  email?: string
  link?: string
}

/* Components Types */

type MotionOptions = MotionNodeAnimationOptions

interface TocItem {
  id: string
  text: string
  level: number
}

/* MDX Types */

interface PostsMetadata {
  title: string
  description: string
  image: string
  date: string
  tags?: string[]
  author?: AuthorInfo
  published?: boolean
  slug: string
}

interface Posts {
  metadata: PostsMetadata
  content: string
}

export type { MotionOptions, Posts, PostsMetadata, TocItem }
