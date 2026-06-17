import type { Posts, PostsMetadata } from '@/types'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { format } from 'date-fns'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { cacheLife, cacheTag } from 'next/cache'

import { AUTHOR_INFO } from '@/constants'

const AUTHOR = {
  ...AUTHOR_INFO,
  link: process.env.SITE_URL || AUTHOR_INFO.link
}

const MDX_SLUG_RE = /\.mdx?$/

const postsDirectory = path.join(process.cwd(), 'content/posts')

function normalizeMetadata(
  data: PostsMetadata,
  slug: string,
  options?: { dateFormat?: boolean }
) {
  let date = data.date ?? '2026-01-01T00:00:00.000Z'

  if (options?.dateFormat) date = format(new Date(date), 'yyyy-MM-dd')

  return {
    ...data,
    author: data?.author ?? AUTHOR,
    date,
    slug
  } as PostsMetadata
}

export async function getPostsBySlug(slug: string) {
  'use cache'
  cacheLife('max') // 文件内容基本不变，用最长缓存
  cacheTag(`post-${slug}`)

  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const posts: Posts = {
    metadata: normalizeMetadata(data as PostsMetadata, slug),
    content
  }

  return posts
}

export async function getPostsMetadata(file: string) {
  const slug = file.replace(MDX_SLUG_RE, '').replace(/\\/g, '/')
  const filePath = path.join(postsDirectory, file)
  const fileContents = await fs.readFile(filePath, 'utf-8')

  const { data } = matter(fileContents)

  const postsMetadata = normalizeMetadata(data as PostsMetadata, slug, {
    dateFormat: true
  })

  return postsMetadata
}

export async function getAllPosts() {
  'use cache'
  cacheLife('max')
  cacheTag('all-posts')

  const files = await fg('**/*.{md,mdx}', {
    cwd: postsDirectory,
    absolute: false
  })

  const posts = await Promise.all(
    files.map(async (file) => await getPostsMetadata(file))
  )

  return posts
    .filter((post) => {
      const { title, description, date, published } = post
      return title && description && date && published !== false
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getAllPostSlugs() {
  const files = await fg('**/*.{md,mdx}', {
    cwd: postsDirectory,
    absolute: false
  })

  const slugs = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(MDX_SLUG_RE, '').replace(/\\/g, '/')
      const filePath = path.join(postsDirectory, file)
      const fileContents = await fs.readFile(filePath, 'utf-8')
      const { data } = matter(fileContents)

      if (data.published === false || !data.title || !data.date) {
        return null
      }

      return slug
    })
  )

  return slugs.filter(Boolean) as string[]
}
