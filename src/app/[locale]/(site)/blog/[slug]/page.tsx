import type { Posts } from '@/types'

import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getAllPostSlugs, getPostsBySlug } from '@/lib/content'
import { PostsPage } from '@/views/blog'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
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

  return (
    <Suspense fallback={null}>
      <PostsPage posts={posts} />
    </Suspense>
  )
}
