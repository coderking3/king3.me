import type { PostsMetadata } from '@/types'

import Image from 'next/image'
import Link from 'next/link'

function PostsCard({ metadata }: { metadata: PostsMetadata }) {
  const { slug, title, description, image, date, tags = [] } = metadata

  return (
    <article className="group border-border block cursor-pointer rounded-2xl border bg-transparent backdrop-blur-xs backdrop-saturate-150 transition-all duration-300">
      <Link href={`/blog/${slug}`}>
        {/* 封面图片 */}
        <div className="relative aspect-10/4 w-full overflow-hidden rounded-t-2xl select-none">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* 文章信息 */}
        <div className="space-y-3 px-6 py-3">
          {/* 日期和标签 */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <time className="font-medium">{date}</time>
            {tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 2).map((tag) => (
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
          <h3 className="text-primary decoration-brand text-xl leading-snug font-semibold transition group-hover:underline">
            {title}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default PostsCard
