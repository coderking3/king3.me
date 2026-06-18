import { generateFeed } from '@/lib/rss'

const FEED_MAX_AGE = 3600

// RSS 2.0 format
export async function GET() {
  try {
    const feed = await generateFeed()

    return new Response(feed.rss2(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `public, max-age=${FEED_MAX_AGE}, s-maxage=${FEED_MAX_AGE}, stale-while-revalidate=86400`
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
