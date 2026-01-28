'use client'

import type { MotionOptions } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { NAVIGATION_ITEMS } from '@/config'
import { cn } from '@/lib/utils'

interface NavbarProps {
  page: string
  className?: string
}

function Navbar({ page, className }: NavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [prevActiveIndex, setPrevActiveIndex] = useState<number>(-1)

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

  // 找到当前 active 项的索引
  const activeIndex = NAVIGATION_ITEMS.findIndex(
    ({ href }) => (page.includes(href) && href !== '/') || page === href
  )

  // 记录上一次的 active 索引
  useEffect(() => {
    if (activeIndex !== -1) {
      setPrevActiveIndex(activeIndex)
    }
  }, [activeIndex])

  // 计算每个项的动画延迟（波浪效果）
  const getNavItemDelay = (index: number) => {
    const animateDelay = 0.04 // 4ms

    // 如果有 active 项，从 active 项开始波浪扩散
    if (activeIndex !== -1) {
      return Math.abs(index - activeIndex) * animateDelay
    }

    // 如果没有 active 项但有之前的 active，从之前的位置开始波浪还原
    if (prevActiveIndex !== -1) {
      return Math.abs(index - prevActiveIndex) * animateDelay
    }

    return 0
  }

  const navItemMotion: (i: number) => MotionOptions = (i) => ({
    initial: { y: 0 },
    animate: {
      y: activeIndex === -1 ? 0 : -2
    },

    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 12,
      delay: getNavItemDelay(i)
    }
  })

  return (
    <nav className={cn('relative h-11 overflow-hidden', className)}>
      <ul className="flex h-full items-center justify-center text-sm">
        {NAVIGATION_ITEMS.map(({ href, name }, i) => {
          const isActive = activeIndex === i
          const isHovered = hoveredItem === href

          return (
            <motion.li
              key={name}
              className="relative select-none"
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredItem(href)}
              onHoverEnd={() => setHoveredItem(null)}
              {...navItemMotion(i)}
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
                    className={cn(
                      'bg-primary/5 dark:bg-primary/10 absolute -z-20 h-8 w-full rounded-full',
                      activeIndex !== -1 ? 'top-1.5' : 'top-1'
                    )}
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

export default Navbar
