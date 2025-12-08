'use client'

import { useEffect, useRef } from 'react'

const color = '#88888825'

export default function ArtSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      // 将 canvas 设置为全屏
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    // 雪花对象数组
    const flakes = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      speedY: Math.random() * 1 + 0.5,
      speedX: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.7 + 0
    }))

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      flakes.forEach((f) => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        f.y += f.speedY
        f.x += f.speedX

        if (f.y > window.innerHeight) {
          f.y = -10
          f.x = Math.random() * window.innerWidth
        }
      })

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-1 dark:invert">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
