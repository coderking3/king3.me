import { Posts } from '@/components/blocks'

const description =
  'Writing blog posts is one of my favorite ways to share and reflect, and I hope to pass on useful technical knowledge to more people. I prefer writing about technical topics, but I also write about non-technical topics, such as photography and personal reflections.'
export const metadata = {
  title: 'My Blog',
  description
}

export default function Page() {
  return (
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <header className="max-w-2xl">
          {/* text-primary mb-6 font-mono text-6xl font-medium tracking-tight */}
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            Welcome to my blog
          </h1>
          <p className="text-muted-foreground mt-6 text-lg">
            {/* <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400"> */}
            {description}
          </p>
        </header>

        <div className="mt-20 grid grid-cols-2 gap-8">
          <Posts limit={12} />
        </div>
      </div>
    </div>
  )
}
