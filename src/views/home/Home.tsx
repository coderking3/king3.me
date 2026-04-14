import type { PostsMetadata } from '@/types'

import { PencilLine } from 'lucide-react'

import { GALLERYS } from '@/constants'
import { getT } from '@/i18n/server'

import PostsCard from '../blog/PostsCard'
import FeaturedMusic from './FeaturedMusic'
import Gallery from './Gallery'
import Hero from './Hero'

interface Song {
  name: string
  author: string[]
  cover: string
  url: string
  duration: string
}

export default async function Home({
  songs,
  posts
}: {
  songs: Song[]
  posts: PostsMetadata[]
}) {
  const { t } = await getT('home')

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Hero />
      </div>

      <Gallery images={GALLERYS} />

      {/* Posts section */}
      <div className="relative mx-auto mt-16 flex max-w-6xl flex-col gap-10 px-4 sm:mt-24 sm:px-8 md:mt-28 lg:flex-row">
        {/* Left: post list */}
        <div className="flex-1">
          <h2 className="text-primary mt-2 mb-6 flex items-center text-lg font-semibold">
            <PencilLine size={20} />
            <span className="ml-3">{t('latestUpdates')}</span>
            {/* <span className="ml-3">Latest Updates</span> */}
          </h2>

          <div className="space-y-8">
            {posts.map((post) => (
              <PostsCard key={post.slug} metadata={post} />
            ))}
          </div>
        </div>

        {/* Right: sidebar */}
        <aside className="sticky hidden h-fit w-full space-y-8 md:block lg:top-8 lg:w-90">
          <FeaturedMusic songs={songs} />
        </aside>
      </div>
    </div>
  )
}
