'use client'

import { PencilLine } from 'lucide-react'
import Image from 'next/image'

import { Hero } from '@/components/index'
import { Equalizer } from '@/icons/Equalizer'

const posts = [
  {
    id: 1,
    title: 'Building a Modern Blog with Next.js 14',
    excerpt:
      'Exploring the latest features of Next.js 14 including Server Components, Server Actions, and the new App Router architecture.',
    date: '2024-12-20',
    readTime: '8 min read',
    tags: ['Next.js', 'React', 'Web Development'],
    coverImage:
      'https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png'
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS: Tips and Tricks',
    excerpt:
      'A comprehensive guide to writing maintainable and scalable CSS with Tailwind, including custom configurations and best practices.',
    date: '2024-12-15',
    readTime: '6 min read',
    tags: ['CSS', 'Tailwind', 'Design'],
    coverImage:
      'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png'
  },
  {
    id: 3,
    title: 'TypeScript Advanced Patterns',
    excerpt:
      'Deep dive into advanced TypeScript patterns including conditional types, mapped types, and template literal types.',
    date: '2024-12-10',
    readTime: '10 min read',
    tags: ['TypeScript', 'JavaScript'],
    coverImage:
      'https://i0.hdslb.com/bfs/openplatform/47696dfbc15966645d7d3374306e1e0976cb48b3.jpg'
  },
  {
    id: 4,
    title: 'State Management in React: A Complete Guide',
    excerpt:
      'Comparing different state management solutions from useState to Zustand, Redux, and Jotai.',
    date: '2024-12-05',
    readTime: '12 min read',
    tags: ['React', 'State Management'],
    coverImage:
      'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg'
  }
]

export default function Page() {
  return (
    <div className="mt-24 mb-20">
      <section className="mx-auto max-w-6xl px-8">
        <Hero />
      </section>

      {/* <Gallery
        images={[
          'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png',
          'https://i0.hdslb.com/bfs/openplatform/47696dfbc15966645d7d3374306e1e0976cb48b3.jpg',
          'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg',
          'https://i0.hdslb.com/bfs/openplatform/8c8b12e1097d36605790a7a91e8e98968f7589f4.jpg',
          'https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg',
          'https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png'
        ]}
      /> */}

      {/* 文章区域 */}
      <section className="relative mx-auto mt-20 flex max-w-6xl flex-col gap-10 px-8 lg:flex-row">
        {/* 左侧文章列表 */}
        <div className="flex-1">
          <h2 className="text-primary mb-8 flex items-center text-xl font-semibold">
            <PencilLine size={22} />
            <span className="ml-2">Latest Updates</span>
          </h2>

          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group border-border bg-card cursor-pointer rounded-2xl border transition-all duration-300"
              >
                {/* 封面图片 */}
                <div className="relative aspect-2/1 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* 文章信息 */}
                <div className="space-y-3 p-6">
                  {/* 日期和标签 */}
                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                    <time className="font-medium">{post.date}</time>
                    {post.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* 标题 */}
                  <h3 className="group-hover:text-primary text-xl leading-snug font-semibold transition-colors">
                    {post.title}
                  </h3>

                  {/* 摘要 */}
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 右侧边栏 */}
        <aside className="sticky top-24 h-fit w-full space-y-8 lg:w-[360px]">
          <div className="border-border bg-card rounded-2xl border p-6">
            <h2 className="text-primary mb-6 flex items-center text-xl font-semibold">
              <Equalizer size={22} />
              <span className="ml-2">Recently Played</span>
            </h2>

            <div className="space-y-3">
              {[
                {
                  image:
                    'https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg',
                  title: 'Blinding Lights',
                  artist: 'The Weeknd'
                },
                {
                  image:
                    'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png',
                  title: '朵',
                  artist: '赵雷'
                },
                {
                  image:
                    'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg',
                  title: '葡萄成熟时',
                  artist: '陈奕迅'
                }
              ].map((track, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="group hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                    <Image
                      src={track.image}
                      alt={track.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {track.title}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {track.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
