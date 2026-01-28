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
    tags: ['Next.js', 'React', 'Web Development']
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS: Tips and Tricks',
    excerpt:
      'A comprehensive guide to writing maintainable and scalable CSS with Tailwind, including custom configurations and best practices.',
    date: '2024-12-15',
    readTime: '6 min read',
    tags: ['CSS', 'Tailwind', 'Design']
  },
  {
    id: 3,
    title: 'TypeScript Advanced Patterns',
    excerpt:
      'Deep dive into advanced TypeScript patterns including conditional types, mapped types, and template literal types.',
    date: '2024-12-10',
    readTime: '10 min read',
    tags: ['TypeScript', 'JavaScript']
  },
  {
    id: 4,
    title: 'State Management in React: A Complete Guide',
    excerpt:
      'Comparing different state management solutions from useState to Zustand, Redux, and Jotai.',
    date: '2024-12-05',
    readTime: '12 min read',
    tags: ['React', 'State Management']
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

      <section className="relative mx-auto mt-20 flex max-w-6xl flex-col justify-between gap-10 px-8 lg:flex-row">
        <div className="flex-1 flex-col space-y-8 pt-4">
          <h2 className="text-primary flex items-center gap-1 text-xl font-semibold">
            <PencilLine size={22} />
            <span className="ml-2">Latest Updates</span>
          </h2>
          {/* group relative flex w-full transform-gpu flex-col rounded-3xl bg-transparent ring-2 ring-[--post-image-bg] transition-transform hover:-translate-y-0.5 */}

          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group border-border overflow-hidden rounded-2xl border p-2 transition-all duration-300"
              >
                {/* relative aspect-[240/135] w-full */}
                <div className="relative aspect-240/135 w-full overflow-hidden rounded-xl">
                  <Image
                    src="https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png"
                    alt={post.title}
                    fill
                    className="object-cover"
                  ></Image>
                </div>
                <span></span>
                {/* <div className="space-y-3">
                  <div className="text-muted-foreground flex items-center gap-3 text-sm">
                    <time>{post.date}</time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="group-hover:text-accent-foreground text-2xl font-semibold transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div> */}
              </article>
            ))}
          </div>
        </div>
        <aside className="sticky space-y-8 lg:w-[420px]">
          <div className="border-border rounded-2xl border p-6">
            <h2 className="text-primary mb-4 flex items-center text-lg font-semibold">
              <Equalizer size={22} />
              <span className="ml-2">Recently Played</span>
            </h2>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded">
                  <Image
                    src="https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg"
                    alt="music-bg"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    Blinding Lights
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    The Weeknd
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded">
                  <Image
                    src="https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png"
                    alt="music-bg"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">朵</p>
                  <p className="text-muted-foreground truncate text-xs">赵雷</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded">
                  <Image
                    src="https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg"
                    alt="music-bg"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">葡萄成熟时</p>
                  <p className="text-muted-foreground truncate text-xs">
                    陈奕迅
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
