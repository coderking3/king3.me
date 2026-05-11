import type { Posts } from '@/types'

import Image from 'next/image'

import { Animated } from '@/components'
import { evaluateMdx } from '@/components/mdx'
import { getT } from '@/i18n/server'

import PostsActions from './PostsActions'
import PostsFloatingBar from './PostsFloatingBar'
import PostsTableOfContents, { ARTICLE_TITLE } from './PostsTableOfContents'

interface PostsPageProps {
  posts: Posts
}

async function PostsPage({ posts }: PostsPageProps) {
  const { lang } = await getT()

  const { metadata, content } = posts
  const date = new Date(metadata.date)

  const { mdx, toc } = await evaluateMdx({ content })

  return (
    <div className="mt-14 sm:mt-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="relative flex justify-between">
          {/* Left - Actions */}
          <aside className="hidden w-10 shrink-0 sm:mr-3 xl:block">
            <div className="sticky top-24">
              <Animated preset={{ mode: 'slideInLeft', delay: 0.15 }}>
                <PostsActions />
              </Animated>
            </div>
          </aside>

          {/* Center - Article */}
          <Animated
            as="article"
            preset={{ mode: 'fadeIn', delay: 0.15 }}
            className="w-full lg:max-w-3xl lg:min-w-0"
          >
            <header className="mb-8 sm:mb-12">
              {metadata.image && (
                <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl shadow-xl dark:shadow-white/5">
                  <Image
                    src={metadata.image}
                    alt={metadata.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <h1
                id={ARTICLE_TITLE}
                className="text-primary mb-4 text-3xl font-bold text-balance sm:text-[2.625rem]"
              >
                {metadata.title}
              </h1>

              {metadata.description && (
                <p className="text-muted-foreground mb-6 text-base text-pretty">
                  {metadata.description}
                </p>
              )}

              {/* Meta */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <time dateTime={date.toISOString()}>
                  {date.toLocaleDateString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>·</span>
                <span>{metadata.author?.name}</span>

                {/* Tags */}
                {metadata.tags && metadata.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex flex-wrap gap-2">
                      {metadata.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-foreground rounded-md px-2.5 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Content */}
            <main className="prose-mdx">{mdx}</main>
          </Animated>

          {/* Right - Table of contents */}
          <aside className="hidden w-48 shrink-0 pl-2 lg:block">
            <div className="sticky top-24">
              <Animated preset={{ mode: 'slideInRight', delay: 0.15 }}>
                <PostsTableOfContents headings={toc} />
              </Animated>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile floating bar (below xl) */}
      <PostsFloatingBar headings={toc} />
    </div>
  )
}

export default PostsPage
