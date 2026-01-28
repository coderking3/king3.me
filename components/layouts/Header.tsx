'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Feed, Github, LogoIcon, Search, useInteractive } from '@/icons'
// import { useInteractive } from '@/hooks'
import { cn } from '@/lib/utils'

import { ThemeMode } from '../ThemeMode'
import Navbar from './Navbar'

function Logo() {
  const { isHovered, isClicked, handlers } = useInteractive({
    trigger: ['hover', 'click']
  })

  return (
    <Link
      href="/"
      className="text-accent-foreground/85 hover:text-accent-foreground mx-1 flex items-center transition-colors duration-200 select-none"
      {...handlers}
    >
      <span className='relative inline-flex size-8 min-w-8 items-center justify-center rounded-full outline-offset-2 before:absolute before:-inset-1 before:content-[""]'>
        <LogoIcon
          size={30}
          {...{ isHovered, isClicked }}
          variant="bold"
        ></LogoIcon>
      </span>

      <span className="ml-1 font-(family-name:--font-audiowide) text-xl font-normal">
        King3
      </span>
    </Link>
  )
}

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')
  // const isTop = useIsTop(100)

  return (
    <header className="sticky top-0 right-0 left-0 z-50 h-16 w-full pt-4">
      <div className="mx-auto h-full max-w-6xl px-6">
        <div className="flex h-full items-center justify-between">
          {/* Menus */}
          <div className="bg-background/50 dark:bg-background/70 shadow-muted-foreground/10 border-border flex items-center rounded-full border pl-3 shadow-xl backdrop-blur-xs backdrop-saturate-150 dark:shadow-lg">
            {/* Logo */}
            <Logo></Logo>

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
                'bg-background/50 dark:bg-background/70 shadow-muted-foreground/10 border-border text-accent-foreground/85 flex h-11.5 w-auto items-center gap-0.5 rounded-full border px-3 shadow-xl backdrop-blur-xs backdrop-saturate-150 transition-all dark:shadow-lg'
              )}
            >
              {/* Search */}
              <Search />

              {/* Github link */}
              <Github
                href="https://www.github.com/coderking3/king3.me"
                target="_blank"
                rel="noopener noreferrer"
              />

              {/* Theme toggle */}
              <ThemeMode enterAnimationDelay={200} />

              {/* Feed xml */}
              <Feed
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
              ></Feed>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
