import { Feed } from 'feed'

const DOMAIN = 'https://king3-me.vercel.app'
const AUTHOR = {
  name: 'Anthony Fu',
  email: 'hi@antfu.me',
  link: DOMAIN
}

export async function GET() {
  const feed = new Feed({
    title: 'King3',
    description: "King3' Blog",
    id: DOMAIN,
    link: DOMAIN,
    copyright: 'CC BY-NC-SA 4.0 2026 © King3',
    feedLinks: {
      json: `${DOMAIN}/feed.json`,
      atom: `${DOMAIN}/feed.atom`,
      rss: `${DOMAIN}/feed.xml`
    },
    author: AUTHOR,
    image: `${DOMAIN}/`
    // options.author = AUTHOR
    // options.image = 'https://antfu.me/avatar.png'
    // options.favicon = 'https://antfu.me/logo.png'
  })
  /* 
  <title>Anthony Fu</title>
<link>https://antfu.me/</link>
<description>Anthony Fu' Blog</description>
<lastBuildDate>Mon, 22 Dec 2025 01:06:45 GMT</lastBuildDate>
<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
<generator>https://github.com/jpmonette/feed</generator>
  */

  return new Response(feed.rss2(), {
    headers: {
      'content-type': 'application/xml'
    }
  })
}
