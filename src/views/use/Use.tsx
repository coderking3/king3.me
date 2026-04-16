import type { TocItem } from '@/types'

import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { Animated } from '@/components'
import { getT } from '@/i18n/server'
import { cn } from '@/lib/utils'

import PostsTableOfContents from '../blog/PostsTableOfContents'

interface UsePageProps {
  content: string
  headings: TocItem[]
}

async function UsePage({ content, headings }: UsePageProps) {
  const { t } = await getT('use')

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:pr-0 sm:pl-12">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {t('title')}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {t('description')}
          </Animated>
        </header>

        <div className="relative mt-12 flex justify-between gap-12 sm:mt-20">
          {/* Center - Content */}
          <Animated
            as="article"
            preset={{ mode: 'fadeInUp', delay: 0.12 }}
            className="w-full max-w-3xl min-w-0"
          >
            <main
              className={cn(
                'prose-mdx',
                'prose-headings:text-primary!',
                '[&>h2:first-of-type]:mt-0!'
              )}
            >
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
                      ]
                    ]
                  }
                }}
              />
            </main>
          </Animated>

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
    </div>
  )
}

export default UsePage
