import { PencilLine } from 'lucide-react'

import { FeaturedMusic, Gallery, Hero, Posts } from '@/components/blocks'
import { Gallerys } from '@/data'

export default function Page() {
  return (
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <Hero />
      </div>

      <Gallery images={Gallerys} />

      {/* 文章区域 */}
      <div className="relative mx-auto mt-24 flex max-w-6xl flex-col gap-10 px-8 md:mt-28 lg:flex-row">
        {/* 左侧文章列表 */}
        <div className="flex-1">
          <h2 className="text-primary mt-2 mb-6 flex items-center text-lg font-semibold">
            <PencilLine size={20} />
            <span className="ml-3">Latest Updates</span>
          </h2>

          <div className="space-y-8">
            <Posts limit={10} />
          </div>
        </div>

        {/* 右侧边栏 */}
        <aside className="sticky top-21 h-fit w-full space-y-8 lg:w-90">
          {/* 我的歌单 */}
          <FeaturedMusic />
        </aside>
      </div>
    </div>
  )
}
