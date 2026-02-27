import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'

import type { Posts } from '@/types'

import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

import { Animated } from '@/components'
import { extractHeadings } from '@/lib/posts'
import { cn } from '@/lib/utils'

import { PostsActions, PostsTableOfContents } from '..'

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
    <div className="mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative flex justify-between">
          {/* 左侧 - 快捷操作 */}
          <aside className="mr-1 ml-[13px] hidden w-10 shrink-0 xl:block">
            <div className="sticky top-24">
              <Animated preset="slideInLeft" delay={0.15}>
                <PostsActions />
              </Animated>
            </div>
          </aside>

          {/* 中间 - 文章主体 */}
          <article className="w-full max-w-3xl min-w-0">
            <Animated preset="fadeIn" delay={0.15}>
              {/* 文章头部 */}
              <header className="mb-12">
                {/* 封面图 */}
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

                {/* 标题 */}
                <h1 className="text-primary mb-4 text-4xl font-bold text-balance lg:text-5xl">
                  {metadata.title}
                </h1>

                {/* 描述 */}
                {metadata.description && (
                  <p className="text-muted-foreground mb-6 text-lg text-pretty">
                    {metadata.description}
                  </p>
                )}

                {/* Meta 信息 */}
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

                  {/* 标签 */}
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

              {/* 内容区域 */}
              <main
                className={cn(
                  'prose prose-lg dark:prose-invert',
                  'prose-headings:text-primary prose-headings:scroll-mt-24',
                  'prose-p:text-foreground prose-p:tracking-tight prose-p:text-base',
                  'prose-a:text-brand prose-a:opacity-80 prose-a:no-underline hover:prose-a:underline hover:prose-a:opacity-100',
                  'prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-li:text-base',
                  'prose-strong:text-foreground prose-strong:font-bold',
                  'prose-code:text-foreground',
                  'prose-img:opacity-90 prose-img:rounded-lg',
                  'max-w-none'
                )}
              >
                <MDXRemote
                  source={content}
                  options={{
                    mdxOptions: {
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

          {/* 右侧 - 目录导航 */}
          <aside className="hidden w-48 shrink-0 pl-2 xl:block">
            <div className="sticky top-24">
              <Animated preset="slideInRight" delay={0.15}>
                <PostsTableOfContents headings={headings} />
              </Animated>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default PostsPage
