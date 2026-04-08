import type { Poem } from '@/types'

import { Animated } from '@/components'

export const title = 'Poems'
export const description =
  'Words that resonate — collected verses and original pieces.'

function PoemsPage({ poems }: { poems: Poem[] }) {
  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-8">
        {/* Header */}
        <Animated as="header" preset="fadeInUp">
          <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
            {title}
          </h1>
        </Animated>
        <Animated preset={{ mode: 'fadeInUp', delay: 0.06 }}>
          <p className="text-muted-foreground mt-3 text-base">{description}</p>
        </Animated>

        {/* Poems list */}
        <div className="mt-12 space-y-10">
          {poems.map((poem, i) => (
            <Animated
              key={poem.id}
              preset={{ mode: 'fadeInUp', delay: 0.12 + i * 0.04 }}
            >
              <article className="border-border/50 border-l-2 pl-6">
                <h2 className="text-foreground text-lg font-medium">
                  {poem.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {poem.author}
                </p>
                <div className="text-foreground/85 mt-4 space-y-1 text-[0.95rem] leading-relaxed whitespace-pre-line">
                  {poem.content}
                </div>
                <time className="text-muted-foreground/60 mt-3 block text-xs">
                  {new Date(poem.createdAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </article>
            </Animated>
          ))}

          {poems.length === 0 && (
            <Animated preset={{ mode: 'fadeInUp', delay: 0.12 }}>
              <p className="text-muted-foreground py-20 text-center text-sm">
                No poems yet.
              </p>
            </Animated>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoemsPage
