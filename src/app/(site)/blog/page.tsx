import type { Metadata } from 'next'

import { getT } from '@/i18n/server'
import { getAllPosts } from '@/lib/posts'
import { BlogPage } from '@/views/blog'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.blog.title')
  const description = t('metadata.blog.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 12)

  return <BlogPage posts={posts} />
}
