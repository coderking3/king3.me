import { generateFeed } from '@/lib/rss'

// ISR: 每小时重新验证一次
export const revalidate = 3600

// RSS 2.0 格式
export async function GET() {
  try {
    const feed = await generateFeed()

    return new Response(feed.rss2(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `public, max-age=${revalidate}, s-maxage=${revalidate}, stale-while-revalidate=86400`
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
