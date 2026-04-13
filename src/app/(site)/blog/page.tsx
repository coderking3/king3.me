import type { Metadata } from 'next'

import { getAllPosts } from '@/lib/posts'
import { blogDescription, BlogPage } from '@/views/blog'

export const metadata = {
  title: 'My Blog',
  description: blogDescription
} satisfies Metadata

export default async function Page() {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 12)

  return <BlogPage posts={posts} />
}
