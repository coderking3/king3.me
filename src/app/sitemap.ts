// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/constants'
import { routing } from '@/i18n/routing'
import { getAllPosts } from '@/lib/content'

const url = (path: string) => new URL(path, SITE_URL).href

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const staticRoutes = [
    '',
    '/blog',
    '/about',
    '/project',
    '/use',
    '/message',
    '/poems',
    '/photos'
  ]

  const staticMap = routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: url(`/${locale}${route}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8
    }))
  ) satisfies MetadataRoute.Sitemap

  const dynamicMap = routing.locales.flatMap((locale) =>
    posts.map((post) => ({
      url: url(`/${locale}/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  ) satisfies MetadataRoute.Sitemap

  return [...staticMap, ...dynamicMap]
}
