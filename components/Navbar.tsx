'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { navigationItems } from '@/config/nav'
import { cn } from '@/lib/utils'

interface NavbarProps {
  page: string
  className?: string
}

function Navbar({ page, className }: NavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <nav
      className={cn(
        // 'relative h-11 overflow-hidden bg-transparent',
        'relative h-11 overflow-hidden rounded-full',
        'bg-background/50 dark:bg-background/70 shadow-primary/5 dark:shadow-primary/0 shadow-xl',
        'backdrop-blur-[3px] backdrop-saturate-150',
        'border-border border',
        className
      )}
    >
      <ul className="text-primary flex items-center justify-center bg-transparent px-3 text-sm font-medium">
        {navigationItems.map(({ href, name }) => {
          const isActive =
            (page.includes(href) && href !== '/') || page === href
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
            >
              {/* Active 底部指示器 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    /* 改动：使用 border-primary 增加视觉权重 */
                    className="border-accent-foreground/15 dark:border-primary/30 absolute bottom-1 left-1/4 -z-10 mx-auto w-1/2 rounded-full border-b-[3px]"
                    layoutId="activeIndicator"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Active 光晕 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    /* 改动：颜色调淡到 10%，避免在 Bento 风格下干扰视线 */
                    className="bg-primary/10 dark:bg-primary/20 absolute top-1/2 left-1/2 -z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Hover 药丸 */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="bg-primary/5 dark:bg-primary/10 absolute top-1.5 -z-20 h-8 w-full rounded-full"
                    layoutId="hoverPill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    // style={{
                    //   /* 改动：10% 改为更细腻的 5% */
                    //   backgroundColor:
                    //     'color-mix(in oklab, var(--primary) 5%, transparent)'
                    // }}
                    transition={{
                      layout: {
                        type: 'spring',
                        stiffness: 380,
                        damping: 30
                      },
                      opacity: { duration: 0.2 }
                    }}
                  />
                )}
              </AnimatePresence>

              <Link href={href} className="block px-3 py-2.5">
                <motion.span
                  className={cn(
                    /* 改动：非激活态用 muted-foreground，激活态用 primary，对比更清晰 */
                    'text-muted-foreground relative text-sm font-bold transition-colors',
                    isActive && 'text-accent-foreground'
                  )}
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.05 },
                    tap: { scale: 0.96 }
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 17
                  }}
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
