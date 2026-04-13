'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { LocaleSwitcher, ThemeMode } from '@/components'
import { useIsMobile } from '@/hooks'
import { Feed, Search } from '@/icons'
import { useSession } from '@/lib/auth-client'
import { clamp } from '@/lib/math'
import { cn } from '@/lib/utils'

import Logo from './Logo'
import MobileNav from './MobileNav'
import Navbar from './Navbar'
import UserAvatar from './UserAvatar'

const headerGlassCardClass =
  'from-background/70 to-background/90 border-border/70 dark:border-border shadow-muted-foreground/3 dark:shadow-muted-foreground/5 flex items-center rounded-full border bg-linear-to-b shadow-lg backdrop-blur-xs backdrop-saturate-150'

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')
  const { data: session } = useSession()

  const isMobile = useIsMobile()
  const isInitial = useRef(true)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const downDelay = isMobile ? 36 : 64
    const upDelay = isMobile ? 36 : 64

    function setProperty(property: string, value: string | null) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return
      }

      const { top, height } = headerRef.current.getBoundingClientRect()
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
        removeProperty('--avatar-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
        setProperty('--avatar-top', '0px')
      }
    }

    function updateStyles() {
      updateHeaderStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
  }, [isMobile])

  return (
    <>
      <motion.header
        className="relative z-50 mb-(--header-mb,0px) flex h-(--header-height,140px) flex-col md:h-(--header-height,180px)"
        layout
        layoutRoot
      >
        <div
          ref={headerRef}
          className="top-0 z-10 h-14 pt-5 md:h-16 md:pt-6"
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position']
          }}
        >
          <div
            className="inset-x-0 top-(--header-top,--spacing(6))"
            style={{
              position:
                'var(--header-inner-position)' as React.CSSProperties['position']
            }}
          >
            <div className="mx-auto h-full max-w-6xl px-3 sm:px-8">
              {/* Mobile: single full-width capsule */}
              <div
                className={cn(
                  headerGlassCardClass,
                  'h-11.5 w-full justify-between px-2 sm:px-3 md:hidden'
                )}
              >
                <div className="flex items-center">
                  <MobileNav />
                  <Logo />
                </div>
                <div className="text-accent-foreground/85 flex items-center gap-0.5">
                  <Search />
                  <UserAvatar user={session?.user ?? null} />
                  <LocaleSwitcher />
                  <ThemeMode enterAnimationDelay={200} />
                </div>
              </div>

              {/* Desktop: dual capsule layout */}
              <div className="relative hidden h-full items-center justify-between md:flex">
                <div className={cn(headerGlassCardClass, 'h-11.5 pr-0 pl-3')}>
                  <Logo />
                  <div className="bg-border ml-3 h-6 w-[1.5px]" />
                  <div className="flex flex-1 items-center justify-center">
                    <Navbar page={page} className="pr-3 pl-1.5" />
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-end">
                  <div
                    className={cn(
                      headerGlassCardClass,
                      'text-accent-foreground/85 h-11.5 w-auto gap-0.5 px-3 transition-all'
                    )}
                  >
                    <Search />
                    <UserAvatar user={session?.user ?? null} />
                    <LocaleSwitcher />
                    <ThemeMode enterAnimationDelay={200} />
                    <Feed
                      href="/feed.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
      <div className="h-[--content-offset]" />
    </>
  )
}

export default Header
