import { Feed } from 'feed'

import { AUTHOR, COPYRIGHT, PROFILE, SITE_URL } from '@/constants'
import { getAllPosts } from '@/lib/content'

const DOMAIN = SITE_URL.href

export async function generateFeed() {
  const posts = await getAllPosts()

  const feed = new Feed({
    title: PROFILE.name,
    description: `${PROFILE.name}s personal website`,
    id: DOMAIN,
    link: DOMAIN,
    copyright: COPYRIGHT,
    author: AUTHOR,
    image: `${DOMAIN}/images/avatar.png`,
    favicon: `${DOMAIN}/icons/favicon.svg`,
    feedLinks: {
      rss2: `${DOMAIN}/feed.xml`,
      json: `${DOMAIN}/feed.json`,
      atom: `${DOMAIN}/feed.atom`
    }
  })

  const recentPosts = posts.slice(0, 20)

  recentPosts.forEach((post) => {
    const { title, description, date, slug, author } = post
    const postUrl = `${DOMAIN}/posts/${slug}`

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
      author: [author ?? AUTHOR]
    })
  })

  return feed
}
