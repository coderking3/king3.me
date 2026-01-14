import type { PostFrontmatter } from '@/types'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'
import { Feed } from 'feed'
import matter from 'gray-matter'

const DOMAIN = process.env.SITE_URL || 'https://king3-me.vercel.app'
const AUTHOR = {
  name: 'King3',
  email: 'king3.wm@gmail.com',
  link: DOMAIN
}

// 获取所有文章
async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/posts')

  // 使用 fast-glob 查找所有 MDX/MD 文件(包括子目录)
  const files = await fg('**/*.{md,mdx}', {
    cwd: postsDirectory,
    absolute: false
  })

  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDirectory, file)
      const fileContents = await readFile(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: file.replace(/\.mdx?$/, '').replace(/\\/g, '/'),
        frontmatter: data as PostFrontmatter
      }
    })
  )

  // 过滤掉草稿和没有必要字段的文章,然后按日期排序
  return posts
    .filter((post) => {
      const { title, description, date, published } = post.frontmatter
      // 必须有 title, description, date，且 published 不为 false
      return title && description && date && published !== false
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

// 生成 Feed
export async function generateFeed() {
  const posts = await getAllPosts()

  const feed = new Feed({
    title: 'King3',
    description: "King3's Blog",
    id: DOMAIN,
    link: DOMAIN,
    copyright: `CC BY-NC-SA 4.0 ${new Date().getFullYear()} © King3`,
    author: AUTHOR,
    image: `${DOMAIN}/avatar.png`,
    favicon: `${DOMAIN}/favicon.svg`,
    feedLinks: {
      rss2: `${DOMAIN}/feed.xml`,
      json: `${DOMAIN}/feed.json`,
      atom: `${DOMAIN}/feed.atom`
    }
  })

  // 添加文章到 feed (通常只添加最近的 20 篇)
  const recentPosts = posts.slice(0, 20)

  recentPosts.forEach((post) => {
    const { title, description, date } = post.frontmatter
    const postUrl = `${DOMAIN}/posts/${post.slug}`

    // 构建 content: description + "Keep reading" 链接
    const contentHtml = `
      <p>${description}</p>
      <div style="margin-top: 32px; font-style: italic;">
        <strong><a href="${postUrl}">Keep reading</a>.</strong>
      </div> <br /> <br />
    `.trim()

    feed.addItem({
      title,
      id: postUrl,
      link: postUrl,
      description,
      content: contentHtml,
      date: new Date(date),
      author: [AUTHOR]
    })
  })

  return feed
}
