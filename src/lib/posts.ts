import type { Posts, PostsMetadata } from '../types'

import type { TocItem } from '@/types'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'
import GithubSlugger from 'github-slugger'
import matter from 'gray-matter'
import { formatDate } from 'kedash'

import { AUTHOR_INFO } from '@/constants'

const AUTHOR = {
  ...AUTHOR_INFO,
  link: process.env.SITE_URL || AUTHOR_INFO.link
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

function normalizeMetadata(
  data: Record<string, any>,
  slug: string,
  options?: { formatDateOutput?: boolean }
) {
  const date = data?.date ? new Date(data.date).getTime() : Date.now()
  return {
    ...data,
    author: data?.author ?? AUTHOR,
    date: options?.formatDateOutput ? formatDate(date) : date,
    slug
  } as PostsMetadata
}

export async function getPostsBySlug(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const posts: Posts = {
    metadata: normalizeMetadata(data, slug),
    content
  }
  return posts
}

export async function getPostsMetadata(file: string) {
  const slug = file.replace(/\.mdx?$/, '').replace(/\\/g, '/')
  const filePath = path.join(postsDirectory, file)
  const fileContents = await fs.readFile(filePath, 'utf-8')

  const { data } = matter(fileContents)

  const postsMetadata = normalizeMetadata(data, slug, {
    formatDateOutput: true
  })
  return postsMetadata
}

export async function getAllPosts() {
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
      // 必须有 title, description, date，且 published 不为 false
      return title && description && date && published !== false
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(\S.*)$/gm
  const headings: TocItem[] = []
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    // 使用 github-slugger 生成与 rehype-slug 一致的id
    const id = slugger.slug(text)

    headings.push({ id, text, level })
  }

  return headings
}
