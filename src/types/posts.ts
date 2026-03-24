interface AuthorInfo {
  name: string
  email?: string
  link?: string
}

export interface PostsMetadata {
  title: string
  description: string
  image: string
  date: string
  tags?: string[]
  author?: AuthorInfo
  published?: boolean
  slug: string
}

export interface Posts {
  metadata: PostsMetadata
  content: string
}
