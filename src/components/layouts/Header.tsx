'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { Feed, Github, Search } from '@/icons'
import { clamp } from '@/lib/math'
import { cn } from '@/lib/utils'

import ThemeMode from '../ThemeMode'
import Logo from './Logo'
import Navbar from './Navbar'

const headerGlassCardClass =
  'from-background/70 to-background/90 border-border/70 dark:border-border shadow-muted-foreground/7 flex items-center rounded-full border bg-linear-to-b shadow-lg backdrop-blur-xs backdrop-saturate-150'

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')

  const isInitial = useRef(true)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const downDelay = 64
    const upDelay = 64

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
  }, [])

  return (
    <>
      <motion.header
        className="relative z-50 mb-(--header-mb,0px) flex h-(--header-height,180px) flex-col"
        layout
        layoutRoot
      >
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position']
          }}
        >
          <div
            className="top-(--header-top,--spacing(6)) w-full"
            style={{
              position:
                'var(--header-inner-position)' as React.CSSProperties['position']
            }}
          >
            <div className="mx-auto h-full max-w-6xl px-6">
              <div className="relative flex h-full items-center justify-between">
                {/* Menus */}
                <div className={cn(headerGlassCardClass, 'pl-3')}>
                  {/* Logo */}
                  <Logo />

                  {/* Divider */}
                  <div className="bg-border ml-3 h-6 w-[1.5px]" />

                  {/* Navbar */}
                  <div className="flex flex-1 items-center justify-center">
                    <Navbar page={page} className="pr-3 pl-1.5" />
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={cn(
                    'header-actions flex flex-1 items-center justify-end'
                  )}
                >
                  <div
                    className={cn(
                      headerGlassCardClass,
                      'text-accent-foreground/85 h-11.5 w-auto gap-0.5 px-3 transition-all'
                    )}
                  >
                    {/* Search icon*/}
                    <Search />

                    {/* GithubLink icon */}
                    <Github
                      href="https://www.github.com/coderking3/king3.me"
                      target="_blank"
                      rel="noopener noreferrer"
                    />

                    {/* ThemeToggle icon */}
                    <ThemeMode enterAnimationDelay={200} />

                    {/* FeedXML icon */}
                    <Feed
                      href="/feed.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                    ></Feed>
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
