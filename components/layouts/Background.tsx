'use client'

import { lazy, Suspense, useState } from 'react'

const ArtDots = lazy(() => import('./ArtDots'))
const ArtPlum = lazy(() => import('./ArtPlum'))
const ArtSnow = lazy(() => import('./ArtSnow'))

type LazyComponent = ReturnType<typeof lazy>

type Art = 'random' | 'plum' | 'dots' | 'snow'
type ArtKey = Exclude<Art, 'random'>

interface BackgroundProps {
  art?: Art
}

const ART_COMPONENTS: Record<ArtKey, LazyComponent> = {
  plum: ArtPlum,
  dots: ArtDots,
  snow: ArtSnow
}

const ART_KEYS: ArtKey[] = Object.keys(ART_COMPONENTS) as ArtKey[]

function Background({ art = 'random' }: BackgroundProps) {
  const [selectedArt] = useState<ArtKey>(() => {
    if (art !== 'random') return art

    const idx = Math.floor(Math.random() * ART_KEYS.length)
    return ART_KEYS[idx]
  })

  const Content = ART_COMPONENTS[selectedArt]

  return (
    <Suspense fallback={null}>
      <div className="pointer-events-none fixed top-0 left-0 z-0 h-dvh w-dvw dark:invert">
        <Content />
      </div>
    </Suspense>
  )
}

export default Background
