import { Animated } from '@/components/common'
import { evaluateMdx } from '@/components/mdx'
import { getT } from '@/i18n/server'
import { getUseContent } from '@/lib/content'
import { cn } from '@/lib/utils'

import PostsTableOfContents from '../blog/PostsTableOfContents'

async function UsePage() {
  const { t, lang } = await getT('use')
  const { content } = await getUseContent(lang)
  const { mdx, toc } = await evaluateMdx({ content })

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
                '[&_:is(:where(h2))]:text-accent-foreground!',
                '[&>h2:first-of-type]:mt-0!'
              )}
            >
              {mdx}
            </main>
          </Animated>

          {/* Right - Table of contents */}
          <aside className="hidden w-48 shrink-0 pl-2 xl:block">
            <div className="sticky top-24">
              <Animated preset={{ mode: 'slideInRight', delay: 0.15 }}>
                <PostsTableOfContents headings={toc} />
              </Animated>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default UsePage
