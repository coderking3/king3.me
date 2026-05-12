import type { Posts } from '@/types'

import { notFound } from 'next/navigation'

import { getPostsBySlug } from '@/lib/posts'
import { PostsPage } from '@/views/blog'

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let posts: Posts
  try {
    posts = await getPostsBySlug(slug)
  } catch {
    notFound()
  }

  return <PostsPage posts={posts} />
}

export const revalidate = 60
