'use client'

import { useEffect, useRef } from 'react'

// 使用纯白，依靠 Opacity 实现灰度变化
const color = '#d4d4d4'
// 设置雪花总数
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
  // 性能优化：预计算颜色字符串
  flakeColor: string
}

/**
 * 优化后的雪花初始化函数
 * @param w 视窗宽度
 * @param h 视窗高度
 * @returns Snowflake 对象
 */
const createSnowflake = (w: number, h: number): Snowflake => {
  // 景深模拟：R越大，速度越快，透明度越高
  const r = Math.random() * 2.5 + 0.5
  // 速度与 R 成正比，增加景深效果
  const speedY = Math.sqrt(r) * (Math.random() * 1.2 + 0.5)
  // Opacity 也与 R 成正比，且至少为 0.3
  const opacity = Math.min(1, Math.random() * 0.3 + r / 3)

  // 预计算颜色字符串，减少 draw 循环中的计算开销
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
  const flakeColor = `${color}${alpha}`

  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r,
    speedY,
    // 基础水平速度
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

      // 高 DPI 屏幕支持
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)

      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      // 重新生成雪花以适应新尺寸（或在每次 resize 时更新初始化尺寸）
      flakes = Array.from({ length: SNOWFLAKE_COUNT }).map(() =>
        createSnowflake(w, h)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      // 优化：使用缓存的 w 和 h
      ctx.clearRect(0, 0, w, h)

      flakes.forEach((f) => {
        // 1. 更新位置和角度
        f.y += f.speedY
        // 优化：使用三角函数模拟自然摇摆
        f.x += f.speedX + Math.cos(f.angle * 0.05) * (f.r * 0.15)
        f.angle += f.rotationSpeed * (f.speedY / 2) // 旋转速度也与下落速度相关联

        // 2. 重置超出边界的雪花
        if (f.y > h) {
          // 使用 createSnowflake 重新生成新位置，保持随机性
          const newFlake = createSnowflake(w, h)
          f.y = newFlake.y - h // 从顶部略微随机的位置开始
          f.x = newFlake.x
          f.r = newFlake.r // 重置所有属性以保持景深分布
          f.speedY = newFlake.speedY
          f.speedX = newFlake.speedX
          f.angle = newFlake.angle
          f.rotationSpeed = newFlake.rotationSpeed
          f.flakeColor = newFlake.flakeColor // 重新计算颜色
        }
        if (f.x > w) {
          f.x = 0
        } else if (f.x < 0) {
          f.x = w
        }

        // 3. 绘制雪花
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        // 优化：直接使用预计算的颜色
        ctx.fillStyle = f.flakeColor

        // 绘制光晕
        if (f.r > 1.5) {
          ctx.shadowBlur = 2.5
          ctx.shadowColor = `rgba(255, 255, 255, ${f.opacity * 0.5})`
        } else {
          ctx.shadowBlur = 1
          ctx.shadowColor = `rgba(255, 255, 255, ${f.opacity * 0.3})`
        }

        ctx.fill()
        ctx.shadowBlur = 0 // 重置 shadowBlur，防止影响后续绘制
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // 移除 dark:invert，确保雪花在深色模式下仍为亮色
  return (
    <div
      id="art-snow"
      className="pointer-events-none fixed inset-0 -z-1 dark:invert print:hidden"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
