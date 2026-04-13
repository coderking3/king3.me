import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'

import type { Posts } from '@/types'

import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { Animated } from '@/components'
import { extractHeadings } from '@/lib/posts'

import PostsActions from './PostsActions'
import PostsFloatingBar from './PostsFloatingBar'
import PostsTableOfContents, { ARTICLE_TITLE } from './PostsTableOfContents'

const author = 'King3'

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  grid: true,
  theme: {
    dark: 'catppuccin-frappe',
    light: 'catppuccin-latte'
  }
}

interface PostsPageProps {
  posts: Posts
}

async function PostsPage({ posts }: PostsPageProps) {
  const { metadata, content } = posts

  const headings = extractHeadings(content)
  const date = new Date(metadata.date)

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
          <article className="w-full max-w-3xl min-w-0">
            <Animated preset={{ mode: 'fadeIn', delay: 0.15 }}>
              <header className="mb-8 sm:mb-12">
                {metadata.image && (
                  <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
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
                  className="text-primary mb-4 text-3xl font-bold text-balance sm:text-4xl lg:text-5xl"
                >
                  {metadata.title}
                </h1>

                {metadata.description && (
                  <p className="text-muted-foreground mb-6 text-lg text-pretty">
                    {metadata.description}
                  </p>
                )}

                {/* Meta */}
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  <time dateTime={date.toISOString()}>
                    {date.toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>·</span>
                  <span>{author}</span>

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
              <main className="prose-mdx">
                <MDXRemote
                  source={content}
                  options={{
                    parseFrontmatter: false,
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        rehypeSlug,
                        [
                          rehypeAutolinkHeadings,
                          {
                            behavior: 'wrap',
                            properties: {
                              className: ['anchor']
                            }
                          }
                        ],
                        [rehypePrettyCode, rehypePrettyCodeOptions]
                      ]
                    }
                  }}
                />
              </main>
            </Animated>
          </article>

          {/* Right - Table of contents */}
          <aside className="hidden w-48 shrink-0 pl-2 xl:block">
            <div className="sticky top-24">
              <Animated preset={{ mode: 'slideInRight', delay: 0.15 }}>
                <PostsTableOfContents headings={headings} />
              </Animated>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile floating bar (below xl) */}
      <PostsFloatingBar headings={headings} />
    </div>
  )
}

export default PostsPage
