'use client'

import type { MotionOptions } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { NAVIGATION_ITEMS } from '@/constants'
import { cn } from '@/lib/utils'

interface NavbarProps {
  page: string
  className?: string
}

function Navbar({ page, className }: NavbarProps) {
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

  // const placeholderMotions: Record<'wrapper' | 'flowing', MotionOptions> = {
  //   wrapper: {
  //     initial: { opacity: 0 },
  //     animate: { opacity: 1 },
  //     exit: { opacity: 0 }
  //   },
  //   flowing: {
  //     animate: {
  //       x: ['-100%', '300%']
  //     },
  //     transition: {
  //       duration: 2,
  //       repeat: Infinity,
  //       ease: 'linear'
  //     }
  //   }
  // }

  // const showPlaceholder = useMemo(
  //   () =>
  //     !NAVIGATION_ITEMS.some(({ href }) => {
  //       const isActive = (page.includes(href) && href !== '/') || page === href
  //       const isHovered = hoveredItem === href
  //       return isActive || isHovered
  //     }),
  //   [page, hoveredItem]
  // )

  return (
    <nav className={cn('relative h-11 overflow-hidden', className)}>
      <ul className="flex items-center justify-center text-sm">
        {/* 占位符 - 渐变流光 */}
        {/* <AnimatePresence>
          {showPlaceholder && (
            // Placeholder: {
            //   className: "via-muted-foreground/20 dark:via-primary/25 bg-linear-to-r from-transparent to-transparent",
            //   layoutId: "activeIndicator"
            // }

            <Placeholder
              className="absolute bottom-2 left-[calc(50%-3px)] -z-10 h-[1.5px] w-[90%] -translate-x-1/2 overflow-hidden rounded-full bg-transparent"
              {...placeholderMotions.wrapper}
            >
              <motion.div
                className="via-primary/25 dark:via-primary/35 h-full w-1/3 bg-linear-to-r from-transparent to-transparent"
                {...placeholderMotions.flowing}
              />
            </Placeholder>
          )}
        </AnimatePresence> */}

        {NAVIGATION_ITEMS.map(({ href, name }) => {
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

// const Placeholder = styled(motion.div)`
//   mask-image: linear-gradient(
//     to right,
//     transparent 0%,
//     black 10%,
//     black 90%,
//     transparent 100%
//   );
// `

export default Navbar
