import type { Poem } from '@/types'

import { Animated } from '@/components'

export const title = 'Poems'
export const description =
  'Words that resonate — collected verses and original pieces.'

function PoemsPage({ poems }: { poems: Poem[] }) {
  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {title}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {description}
          </Animated>
        </header>

        {/* Poems list */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {poems.map((poem, i) => (
            <Animated
              key={poem.id}
              preset={{ mode: 'fadeInUp', delay: 0.12 + i * 0.04 }}
              className="border-border/50 hover:border-primary/50 before:bg-muted/50 relative isolate rounded-r-lg border-l-2 py-4 pr-4 pl-6 transition-colors duration-200 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:rounded-r-lg before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100"
            >
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
