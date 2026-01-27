'use client'

import { Music, PencilLine } from 'lucide-react'

import { Gallery, Hero } from '@/components/index'

export default function Page() {
  return (
    <div className="mt-24 mb-20">
      <div className="mx-auto max-w-6xl px-8">
        <Hero />
      </div>

      <Gallery
        images={[
          'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png',
          'https://i0.hdslb.com/bfs/openplatform/47696dfbc15966645d7d3374306e1e0976cb48b3.jpg',
          'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg',
          'https://i0.hdslb.com/bfs/openplatform/8c8b12e1097d36605790a7a91e8e98968f7589f4.jpg',
          'https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg',
          'https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png'
        ]}
      />

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-y-20 px-8">
        <div className="flex flex-col gap-6 pt-6">
          <h2 className="flex items-center font-semibold text-zinc-900 dark:text-zinc-100">
            <PencilLine size={20} />
            <span className="ml-2">Latest Updates</span>
          </h2>

          {Array.from({ length: 15 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="border-border rounded-2xl border p-6">
              111
            </div>
          ))}
        </div>
        {/* spacFQe-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20 */}
        <aside className="space-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20">
          <div className="border-border rounded-2xl border p-6">
            <h2 className="mb-6 flex items-center text-sm font-semibold">
              <Music size={20} />
              <span className="ml-2">1</span>
            </h2>

            <ul className="flex list-disc flex-col gap-5 pl-6 text-sm">
              <li>I very like's moments 📷</li>
              <li>I very like's traveling ✈️</li>
              <li>I very like's music 🎵</li>
            </ul>
          </div>
          <div className="border-border rounded-2xl border p-6">
            <h2 className="mb-6 flex items-center text-sm font-semibold">
              <Music size={20} />
              <span className="ml-2">1</span>
            </h2>

            <ul className="flex list-disc flex-col gap-5 pl-6 text-sm">
              <li>I very like's moments 📷</li>
              <li>I very like's traveling ✈️</li>
              <li>I very like's music 🎵</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
