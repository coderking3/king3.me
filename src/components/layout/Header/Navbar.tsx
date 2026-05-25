'use client'

import type { MotionOptions } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui'
import { NAVIGATION_ITEMS } from '@/constants'
import { useTranslation } from '@/i18n/client'
import { cn } from '@/lib/utils'

interface NavbarProps {
  page: string
  className?: string
}

export function Navbar({ page, className }: NavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [prevActiveIndex, setPrevActiveIndex] = useState<number>(-1)

  const { t } = useTranslation('common')

  const navigationItems = NAVIGATION_ITEMS.map((item) => ({
    ...item,
    name: t(`nav.${item.key}`)
  }))

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

  const activeIndex = NAVIGATION_ITEMS.findIndex(
    ({ href }) => page.includes(href) || page === href
  )

  useEffect(() => {
    if (activeIndex !== -1) {
      setPrevActiveIndex(activeIndex)
    }
  }, [activeIndex])

  // Wave delay: ripple outward from the active item
  const getNavItemDelay = (index: number) => {
    const animateDelay = 0.04

    if (activeIndex !== -1) {
      return Math.abs(index - activeIndex) * animateDelay
    }

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
        {navigationItems.map(({ key, href, name }, i) => {
          const isActive = activeIndex === i
          const isHovered = hoveredItem === href

          return (
            <motion.li
              key={key}
              className="relative select-none"
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredItem(href)}
              onHoverEnd={() => setHoveredItem(null)}
              {...navItemMotion(i)}
            >
              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="border-muted-foreground/20 dark:border-primary/25 absolute bottom-1 left-1/4 -z-10 mx-auto w-1/2 rounded-full border-b-[3px]"
                    layoutId="activeIndicator"
                    {...commonMotion}
                  />
                )}
              </AnimatePresence>
              {/* Active glow */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="bg-muted-foreground/20 dark:bg-muted-foreground/40 absolute top-1/2 left-1/2 -z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
                    {...commonMotion}
                  />
                )}
              </AnimatePresence>

              {/* Hover pill */}
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

              <Link href={href} prefetch={true} className="block px-3 py-2.5">
                <motion.span
                  className={cn(
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

export function MobileNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')
  const { t } = useTranslation('common')

  const navigationItems = [
    { key: 'home' as const, href: '/' },
    ...NAVIGATION_ITEMS
  ].map((item) => ({
    ...item,
    name: t(`nav.${item.key}`)
  }))

  // Close sheet on route change
  useEffect(() => setOpen(false), [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="text-accent-foreground/85 hover:text-accent-foreground inline-flex size-8 min-w-8 cursor-pointer items-center justify-center rounded-full md:hidden">
        <Menu size={20} />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 sm:max-w-72">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="font-logo text-xl font-normal">
              King3
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {navigationItems.map(({ key, name, href }) => {
              const isActive =
                (page.includes(href) && href !== '/') || page === href

              return (
                <li key={key}>
                  <Link
                    href={href}
                    prefetch={true}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
