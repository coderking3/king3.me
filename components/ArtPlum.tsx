'use client'

import { useEffect, useRef } from 'react'

type Fn = () => void

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const color = '#88888825'
const MIN_BRANCH = 30
const len = 6
const FPS = 40

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}

export default function ArtPlum() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stepsRef = useRef<Fn[]>([])
  const prevStepsRef = useRef<Fn[]>([])
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let w = window.innerWidth
    let h = window.innerHeight

    const initCanvas = () => {
      const ctx = canvas.getContext('2d')!
      const dpr = window.devicePixelRatio || 1

      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width = dpr * w
      canvas.height = dpr * h
      ctx.scale(dpr, dpr)

      return ctx
    }

    let ctx = initCanvas()
    const { random } = Math

    const step = (
      x: number,
      y: number,
      rad: number,
      counter: { value: number } = { value: 0 }
    ) => {
      const length = random() * len
      counter.value += 1

      const [nx, ny] = polar2cart(x, y, length, rad)

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()

      const rad1 = rad + random() * r15
      const rad2 = rad - random() * r15

      if (nx < -100 || nx > w + 100 || ny < -100 || ny > h + 100) return

      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5

      if (random() < rate)
        stepsRef.current.push(() => step(nx, ny, rad1, counter))
      if (random() < rate)
        stepsRef.current.push(() => step(nx, ny, rad2, counter))
    }

    let lastTime = performance.now()
    const interval = 1000 / FPS

    const frame = () => {
      if (performance.now() - lastTime < interval) {
        rafIdRef.current = requestAnimationFrame(frame)
        return
      }

      prevStepsRef.current = stepsRef.current
      stepsRef.current = []
      lastTime = performance.now()

      if (prevStepsRef.current.length === 0) return

      prevStepsRef.current.forEach((fn) => {
        if (random() < 0.5) stepsRef.current.push(fn)
        else fn()
      })

      rafIdRef.current = requestAnimationFrame(frame)
    }

    const randomMiddle = () => random() * 0.6 + 0.2

    const start = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      ctx.strokeStyle = color

      prevStepsRef.current = []
      stepsRef.current = [
        () => step(randomMiddle() * w, -5, r90),
        () => step(randomMiddle() * w, h + 5, -r90),
        () => step(-5, randomMiddle() * h, 0),
        () => step(w + 5, randomMiddle() * h, r180)
      ]

      if (w < 500) stepsRef.current = stepsRef.current.slice(0, 2)

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      frame()
    }

    const handleResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      ctx = initCanvas()
      start()
    }

    window.addEventListener('resize', handleResize)
    start()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  return (
    <div
      id="art-plum"
      className="pointer-events-none fixed inset-0 -z-1 dark:invert print:hidden"
      style={{
        maskImage: 'radial-gradient(circle, transparent, black)',
        WebkitMaskImage: 'radial-gradient(circle, transparent, black)'
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
