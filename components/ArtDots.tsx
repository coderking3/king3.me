'use client'

import type { Texture } from 'pixi.js'

import { Application, Graphics, Particle, ParticleContainer } from 'pixi.js'
import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

const SCALE = 200
const LENGTH = 5
const SPACING = 15

interface Point {
  x: number
  y: number
  opacity: number
  particle: Particle
}

export default function ArtDots() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let app: Application | null = null
    let resizeListener: (() => void) | null = null

    let w = window.innerWidth
    let h = window.innerHeight
    const noise3d = createNoise3D()
    const existingPoints = new Set<string>()
    const points: Point[] = []

    function getForceOnPoint(x: number, y: number, z: number) {
      return (noise3d(x / SCALE, y / SCALE, z) - 0.5) * 2 * Math.PI
    }

    function createDotTexture(application: Application): Texture {
      const g = new Graphics().circle(0, 0, 1).fill(0xcccccc)
      return application.renderer.generateTexture(g)
    }

    function addPoints(
      dotTexture: Texture,
      particleContainer: ParticleContainer
    ) {
      for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
        for (let y = -SPACING / 2; y < h + SPACING; y += SPACING) {
          const id = `${x}-${y}`
          if (existingPoints.has(id)) continue

          existingPoints.add(id)
          const particle = new Particle(dotTexture)
          particle.anchorX = 0.5
          particle.anchorY = 0.5
          particleContainer.addParticle(particle)

          const opacity = Math.random() * 0.5 + 0.5
          points.push({ x, y, opacity, particle })
        }
      }
    }

    const initPixi = async () => {
      if (!mountRef.current) return

      app = new Application()

      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio,
        autoDensity: true
      })

      if (!mountRef.current) {
        app.destroy()
        return
      }

      mountRef.current.appendChild(app.canvas)
      app.renderer.resize(w, h)

      const particleContainer = new ParticleContainer({
        dynamicProperties: { position: true, alpha: true }
      })
      app.stage.addChild(particleContainer)

      const dotTexture = createDotTexture(app)
      addPoints(dotTexture, particleContainer)

      app.ticker.add(() => {
        const t = Date.now() / 10000
        for (const p of points) {
          const { x, y, opacity, particle } = p
          const rad = getForceOnPoint(x, y, t)
          const len = (noise3d(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH
          const nx = x + Math.cos(rad) * len
          const ny = y + Math.sin(rad) * len

          particle.x = nx
          particle.y = ny
          particle.alpha = (Math.abs(Math.cos(rad)) * 0.8 + 0.2) * opacity
        }
      })

      resizeListener = () => {
        w = window.innerWidth
        h = window.innerHeight
        app?.renderer.resize(w, h)
        addPoints(dotTexture, particleContainer)
      }

      window.addEventListener('resize', resizeListener)
    }

    initPixi()

    return () => {
      if (resizeListener) {
        window.removeEventListener('resize', resizeListener)
      }

      try {
        app?.destroy(true, {
          children: true,
          texture: true,
          textureSource: true
        })
      } catch (error) {
        console.error('Pixi destroy error:', error)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="size-screen pointer-events-none fixed inset-0 -z-1 dark:invert"
    />
  )
}
