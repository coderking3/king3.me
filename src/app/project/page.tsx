import type { Metadata } from 'next'

import { Projects } from '@/components/blocks'

const title = 'My Projects'
const description = 'These are all my projects and libraries.'
export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description
  }
} satisfies Metadata

export default function Page() {
  return (
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <header className="max-w-2xl">
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-foreground/80 mt-6 text-lg">{description}</p>
        </header>

        <div className="mt-16 sm:mt-20">
          <Projects />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 3600
