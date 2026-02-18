import type { Posts, PostsMetadata } from '../types'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'
import matter from 'gray-matter'
import { formatDate } from 'kedash'

import { AUTHOR_INFO } from '@/constants'

const AUTHOR = {
  ...AUTHOR_INFO,
  link: process.env.SITE_URL || AUTHOR_INFO.link
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function getPostsBySlug(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })

  const { data, content } = matter(fileContent)

  const posts = {
    metadata: { ...data, date: new Date(data.date).getTime(), slug },
    content
  } as unknown as Posts
  return posts
}

export async function getPostsMetadata(file: string) {
  const slug = file.replace(/\.mdx?$/, '').replace(/\\/g, '/')
  const filePath = path.join(postsDirectory, file)
  const fileContents = await fs.readFile(filePath, 'utf8')

  const { data } = matter(fileContents)

  const postsMetadata = {
    ...data,
    author: data?.author ?? AUTHOR,
    date: formatDate(new Date(data.date).getTime()),
    slug
  } as unknown as PostsMetadata
  return postsMetadata
}

async function getAllPosts() {
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

export { getAllPosts }
