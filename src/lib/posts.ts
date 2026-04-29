import type { Posts, PostsMetadata } from '../types'

import type { TocItem } from '@/types'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { format } from 'date-fns'
import fg from 'fast-glob'
import GithubSlugger from 'github-slugger'
import matter from 'gray-matter'

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
  const date = options?.dateFormat ? format(data.date, 'yyyy-MM-dd') : data.date

  return {
    ...data,
    author: data?.author ?? AUTHOR,
    date,
    slug
  } as PostsMetadata
}

export async function getPostsBySlug(slug: string) {
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

export async function getUseContent(lang: string) {
  const filename = lang === 'en' ? 'use.mdx' : 'use_zh.mdx'
  const content = await fs.readFile(
    path.join(process.cwd(), 'content', filename),
    'utf-8'
  )
  const headings = extractHeadings(content)
  return { content, headings }
}

export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(\S.*)$/gm
  const headings: TocItem[] = []
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    // Matches rehype-slug output
    const id = slugger.slug(text)

    headings.push({ id, text, level })
  }

  return headings
}
