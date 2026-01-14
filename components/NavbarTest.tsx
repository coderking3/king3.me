'use client'

import type { ClassValue } from 'clsx'
import type { MotionNodeAnimationOptions } from 'framer-motion'

import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type MotionOptions = MotionNodeAnimationOptions

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavbarProps {
  page: string
  className?: string
}

export const NAVIGATION_ITEMS = [
  {
    name: 'Blog',
    href: '/blog'
  },
  {
    name: 'Project',
    href: '/project'
  },
  {
    name: 'Message',
    href: '/message'
  },
  {
    name: 'About',
    href: '/about'
  }
]

export function NavbarTest({ page, className }: NavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const commonMotion: MotionOptions = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 30
    }
  }

  const linkTextMotion: MotionOptions = {
    variants: {
      initial: { scale: 1 },
      hover: { scale: 1.05 },
      tap: { scale: 0.96 }
    },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  }
  // 1. 实时计算当前的 activeIndex
  const activeIndex = NAVIGATION_ITEMS.findIndex(
    (item) =>
      (page.includes(item.href) && item.href !== '/') || page === item.href
  )

  // 2. 记录上一个有效的索引。当 activeIndex 变成 -1 时，这个 state 依然保留旧值
  const [lastValidIndex, setLastValidIndex] = useState(0)

  // 3. 使用 useEffect 在渲染完成后更新，避免直接在 render 中访问 ref 或修改 state
  useEffect(() => {
    if (activeIndex !== -1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastValidIndex(activeIndex)
    }
  }, [activeIndex])

  // 4. 动画起点：如果有激活项，就以它为中心；如果没有，就以最后一次激活的项为中心
  const originIndex = activeIndex !== -1 ? activeIndex : lastValidIndex

  return (
    <nav className={cn('relative h-11 overflow-hidden', className)}>
      <ul className="flex h-full items-center justify-center text-sm">
        {NAVIGATION_ITEMS.map(({ href, name }, i) => {
          const isActive = activeIndex === i
          const isHovered = hoveredItem === href

          // 计算到“震源”的距离
          const distance = Math.abs(i - originIndex)

          return (
            <motion.li
              key={name}
              className="relative select-none"
              // 4. 动画状态：全局是否处于 active 状态决定 y 的目标值
              animate={{
                y: activeIndex === -1 ? 0 : -2
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 32,
                mass: 0.8
              }}
              // initial="initial"
              // whileHover="hover"
              // whileTap="tap"
              onHoverStart={() => setHoveredItem(href)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              {/* Active 底部指示器 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="border-muted-foreground/20 dark:border-primary/25 absolute bottom-1 left-1/4 -z-10 mx-auto w-1/2 rounded-full border-b-[3px]"
                    layoutId="activeIndicator"
                    {...commonMotion}
                  />
                )}
              </AnimatePresence>
              {/* Active 光晕 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="bg-muted-foreground/20 dark:bg-muted-foreground/40 absolute top-1/2 left-1/2 -z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
                    {...commonMotion}
                  />
                )}
              </AnimatePresence>

              {/* Hover 药丸 */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="bg-primary/5 dark:bg-primary/10 absolute top-1.5 -z-20 h-8 w-full rounded-full"
                    layoutId="hoverPill"
                    {...commonMotion}
                  />
                )}
              </AnimatePresence>

              <Link href={href} className="block px-3 py-2.5">
                <motion.span
                  className={cn(
                    /* 改动：非激活态用 muted-foreground，激活态用 primary，对比更清晰 */
                    'text-muted-foreground relative font-bold transition-colors',
                    isActive &&
                      'text-accent-foreground/85 hover:text-accent-foreground'
                  )}
                  {...linkTextMotion}
                >
                  {name}
                </motion.span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </nav>
  )
}
