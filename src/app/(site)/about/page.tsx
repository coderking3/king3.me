import type { Metadata } from 'next'

import type { ExploreItem } from '@/components/blocks'

import { Camera, Feather, Wrench } from 'lucide-react'

import { ExploreCard, TechStack } from '@/components/blocks'
import { Animated } from '@/components/common'
import { AUTHOR_INFO } from '@/constants'

const title = 'About Me'
const description = `Hi, I'm ${AUTHOR_INFO.name}. A frontend developer, open-source enthusiast, and creative soul.`

export const metadata = {
  title,
  description,
  openGraph: { title, description }
} satisfies Metadata

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    icon: Camera,
    title: 'Photos',
    description: 'Moments captured through my lens.',
    href: '/photos'
  },
  {
    icon: Feather,
    title: 'Poems',
    description: 'Words that resonate with me.',
    href: '/poems'
  },
  {
    icon: Wrench,
    title: 'Uses',
    description: 'Tools and gear I use daily.',
    href: '/use'
  }
]

export default function Page() {
  return (
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        {/* Header */}
        <Animated as="header" preset="fadeInUp" className="max-w-2xl">
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-foreground/80 mt-6 text-lg leading-relaxed">
            {description}
          </p>
        </Animated>

        {/* Bio */}
        <Animated preset="fadeInUp" delay={0.1} className="mt-12 max-w-2xl">
          <div className="text-foreground/80 space-y-4 text-base leading-relaxed">
            <p>
              I spend most of my time building things for the web — crafting
              interfaces, exploring new frameworks, and contributing to
              open-source projects.
            </p>
            <p>
              Outside of code, I enjoy photography, reading poetry, and
              discovering good music. I believe in learning by creating and
              sharing what I learn along the way.
            </p>
          </div>
        </Animated>

        {/* Tech Stack */}
        <section className="mt-16">
          <Animated preset="fadeInUp" delay={0.15}>
            <h2 className="text-primary mb-6 text-lg font-semibold">
              Tech Stack
            </h2>
          </Animated>
          <TechStack />
        </section>

        {/* Explore */}
        <section className="mt-16 mb-20">
          <Animated preset="fadeInUp" delay={0.15}>
            <h2 className="text-primary mb-6 text-lg font-semibold">
              Explore More
            </h2>
          </Animated>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORE_ITEMS.map((item, index) => (
              <ExploreCard key={item.href} item={item} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
