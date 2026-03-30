'use client'

import { useEffect, useRef } from 'react'

const color = '#d4d4d4'
const SNOWFLAKE_COUNT = 120

interface Snowflake {
  x: number
  y: number
  r: number
  speedY: number
  speedX: number
  opacity: number
  angle: number
  rotationSpeed: number
  flakeColor: string
}

const createSnowflake = (w: number, h: number): Snowflake => {
  // Depth simulation: larger radius → faster speed, higher opacity
  const r = Math.random() * 2.5 + 0.5
  const speedY = Math.sqrt(r) * (Math.random() * 1.2 + 0.5)
  const opacity = Math.min(1, Math.random() * 0.3 + r / 3)

  // Pre-compute color string to avoid per-frame overhead
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
  const flakeColor = `${color}${alpha}`

  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r,
    speedY,
    speedX: Math.random() * 0.6 - 0.3,
    opacity,
    angle: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2.5,
    flakeColor
  }
}

export default function ArtSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let flakes: Snowflake[] = []

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      // HiDPI support
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)

      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      flakes = Array.from({ length: SNOWFLAKE_COUNT }).map(() =>
        createSnowflake(w, h)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      flakes.forEach((f) => {
        // Update position
        f.y += f.speedY
        f.x += f.speedX + Math.cos(f.angle * 0.05) * (f.r * 0.15)
        f.angle += f.rotationSpeed * (f.speedY / 2)

        // Reset out-of-bounds flakes
        if (f.y > h) {
          const newFlake = createSnowflake(w, h)
          f.y = newFlake.y - h
          f.x = newFlake.x
          f.r = newFlake.r
          f.speedY = newFlake.speedY
          f.speedX = newFlake.speedX
          f.angle = newFlake.angle
          f.rotationSpeed = newFlake.rotationSpeed
          f.flakeColor = newFlake.flakeColor
        }
        if (f.x > w) {
          f.x = 0
        } else if (f.x < 0) {
          f.x = w
        }

        // Draw flake
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = f.flakeColor

        // Glow effect
        if (f.r > 1.5) {
          ctx.shadowBlur = 2.5
          ctx.shadowColor = `rgba(255, 255, 255, ${f.opacity * 0.5})`
        } else {
          ctx.shadowBlur = 1
          ctx.shadowColor = `rgba(255, 255, 255, ${f.opacity * 0.3})`
        }

        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="size-full" />
}
