import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import { getAllPosts } from '@/lib/content'
import { BlogPage } from '@/views/blog'

export async function generateMetadata() {
  const t = await getTranslations('metadata.blog')
  const title = t('title')
  const description = t('description')

  return {
    title,
    description,
    openGraph: {
      title,
      description
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default async function Page() {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 12)

  return (
    <Suspense fallback={null}>
      <BlogPage posts={posts} />
    </Suspense>
  )
}
