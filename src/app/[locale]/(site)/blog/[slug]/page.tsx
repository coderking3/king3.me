import type { Metadata } from 'next'

import type { Posts } from '@/types'

import { notFound } from 'next/navigation'

import { PROFILE } from '@/constants'
import { getAllPostSlugs, getPostsBySlug } from '@/lib/content'
import { PostsPage } from '@/views/blog'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const posts = await getPostsBySlug(slug)
  const { metadata } = posts

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      publishedTime: metadata.date,
      authors: [metadata.author?.name ?? ''],
      images: metadata.image ? [{ url: metadata.image }] : undefined
    },
    twitter: {
      site: PROFILE.twitter.name,
      creator: PROFILE.twitter.name,
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: metadata.image ? [{ url: metadata.image }] : undefined
    },
    alternates: {
      canonical: `/${locale}/blog/${slug}`
    }
  } satisfies Metadata
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
