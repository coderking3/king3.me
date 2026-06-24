'use client'

import type { ComponentType } from 'react'

import ArtPlum from './ArtPlum'
import ArtStarry from './ArtStarry'

const ART_COMPONENTS = {
  plum: ArtPlum,
  starry: ArtStarry
} as const satisfies Record<string, ComponentType>

type ArtKey = keyof typeof ART_COMPONENTS

interface BackgroundProps {
  art: ArtKey
}

function Background({ art }: BackgroundProps) {
  const Content = ART_COMPONENTS[art]

  return (
    <div className="pointer-events-none fixed inset-0 z-0 dark:invert">
      <Content />
    </div>
  )
}

export default Background
