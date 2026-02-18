import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'

import type { Posts } from '@/types'

import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

import { extractHeadings } from '@/lib/toc'
import { cn } from '@/lib/utils'

import { PostsTableOfContents } from '..'

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
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <article className="w-full md:flex md:justify-between xl:relative">
          <aside className="hidden w-40 shrink-0 lg:block">
            <div className="sticky top-26">
              <PostsTableOfContents headings={headings} />
            </div>
          </aside>
          <main className="">
            {/* 文章头部 - 全宽 */}
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
              <h1 className="text-primary mb-4 text-4xl font-bold lg:text-5xl">
                {metadata.title}
              </h1>

              {/* 描述 */}
              {metadata.description && (
                <p className="text-muted-foreground mb-6 text-lg">
                  {metadata.description}
                </p>
              )}

              {/* Meta 信息 */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <time dateTime={date.toISOString()}>
                  {date.toLocaleDateString('zh-CN', {
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
            <div
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
            </div>
          </main>
        </article>
      </div>
    </div>
  )
}

export default PostsPage
