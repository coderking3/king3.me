import type { LucideIcon } from 'lucide-react'

import Link from 'next/link'

import { Animated } from '@/components'

export interface ExploreItem {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

function ExploreCard({ item, index }: { item: ExploreItem; index: number }) {
  const { icon: Icon, title, description, href } = item

  return (
    <Animated preset={{ mode: 'fadeInUp', delay: 0.1 + index * 0.08 }}>
      <Link
        href={href}
        className="bg-card hover:bg-accent/50 border-border group flex items-start gap-4 rounded-xl border p-5 transition-colors"
      >
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-primary text-sm font-semibold group-hover:underline">
            {title}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
      </Link>
    </Animated>
  )
}

export default ExploreCard
