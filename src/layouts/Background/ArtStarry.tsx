'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import styles from './ArtStarry.module.css'

const STAR_COUNT = 60

interface Star {
  x: number
  y: number
  size: number
  delay: number
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4
  }))
}

export default function ArtStarry() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(generateStars(STAR_COUNT))
  }, [])

  const largePlanetBg =
    'radial-gradient(circle at 35% 35%, #809fff 0%, #2a3a6e 60%, #0a0e17 100%)'

  const smallPlanetBg =
    'radial-gradient(circle at 40% 30%, #60d394 0%, #1a3a2e 70%, #0a0e17 100%)'

  return (
    <div className="bg-background relative size-full">
      {/* Star field */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={cn(
              'bg-foreground/40 absolute rounded-full dark:bg-white',
              styles.star
            )}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDuration: `${2 + star.delay}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating planet */}
      <motion.div
        className="absolute top-[8%] right-[10%] size-24 rounded-full opacity-20 md:size-32"
        style={{ background: largePlanetBg }}
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Small planet */}
      <motion.div
        className="absolute bottom-[15%] left-[8%] size-12 rounded-full opacity-15 md:size-16"
        style={{ background: smallPlanetBg }}
        animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
