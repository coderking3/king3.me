import { getAllPosts } from '@/lib/content'
import { createPageMetadata } from '@/lib/metadata'
import { BlogPage } from '@/views/blog'

export const metadata = createPageMetadata('blog')

export default async function Page() {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 12)

  return <BlogPage posts={posts} />
}

export const revalidate = 60
