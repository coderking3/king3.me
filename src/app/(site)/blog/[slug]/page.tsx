import type { Posts } from '@/types'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostsBySlug } from '@/lib/posts'
import { PostsPage } from '@/views/blog'

// Generate static pages for all posts at build time
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

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
