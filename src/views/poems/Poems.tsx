import type { Poem } from '@/types'

import { Animated } from '@/components'
import { getT } from '@/i18n/server'

async function PoemsPage({ poems }: { poems: Poem[] }) {
  const { t, lang } = await getT('poems')

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
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
                {new Date(poem.createdAt).toLocaleDateString(lang, {
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
                {t('noPoems')}
              </p>
            </Animated>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoemsPage
