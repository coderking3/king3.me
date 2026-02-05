import process from 'node:process'

import { Feed } from 'feed'

import { getAllPosts } from './posts'

const DOMAIN = process.env.SITE_URL || 'https://king3-me.vercel.app'
const AUTHOR = {
  name: 'King3',
  email: 'king3.wm@gmail.com',
  link: DOMAIN
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
    const { title, description, date, slug } = post
    const postUrl = `${DOMAIN}/posts/${slug}`

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
