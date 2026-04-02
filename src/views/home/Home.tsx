import { PencilLine } from 'lucide-react'

import { GALLERYS } from '@/constants'

import Posts from '../blog/PostsList'
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

export default function Home({ songs }: { songs: Song[] }) {
  return (
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <Hero />
      </div>

      <Gallery images={GALLERYS} />

      {/* Posts section */}
      <div className="relative mx-auto mt-24 flex max-w-6xl flex-col gap-10 px-8 md:mt-28 lg:flex-row">
        {/* Left: post list */}
        <div className="flex-1">
          <h2 className="text-primary mt-2 mb-6 flex items-center text-lg font-semibold">
            <PencilLine size={20} />
            <span className="ml-3">Latest Updates</span>
          </h2>

          <div className="space-y-8">
            <Posts limit={10} />
          </div>
        </div>

        {/* Right: sidebar */}
        <aside className="sticky h-fit w-full space-y-8 lg:top-8 lg:w-90">
          <FeaturedMusic songs={songs} />
        </aside>
      </div>
    </div>
  )
}
