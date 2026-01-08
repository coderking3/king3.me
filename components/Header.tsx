'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Camera, Github, Logo, ThemeMode } from './icons'
import { Feed } from './icons/Feed'
import Navbar from './Navbar'

// const ICON_MAP = {
//   github: Github,
//   photos: Camera
// }

// function LinkIcon() {}

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')
  // const isTop = useIsTop(100)

  return (
    <header className="sticky top-0 right-0 left-0 z-50 h-16 w-full pt-4">
      <div className="mx-auto h-full max-w-6xl px-6">
        <div className="flex h-full items-center justify-between">
          {/* Header Left */}
          <div className="bg-background/50 dark:bg-background/70 shadow-muted-foreground/10 border-border flex items-center rounded-full border pl-3 shadow-xl backdrop-blur-[3px] backdrop-saturate-150 dark:shadow-lg">
            {/* Logo */}
            <div className="text-accent-foreground/85 hover:text-accent-foreground mx-1 flex items-center transition-colors duration-200">
              <Logo href="/" variant="bold" size={30} />

              <span className="ml-1 font-(family-name:--font-google-art) text-xl font-normal">
                King3
              </span>
            </div>

            {/* Divider */}
            <div className="bg-border ml-3 h-6 w-[1.5px]" />

            {/* Navbar */}
            <div className="flex flex-1 items-center justify-center">
              <Navbar page={page} className="pr-3 pl-1.5"></Navbar>
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
                'bg-background/50 dark:bg-background/70 shadow-muted-foreground/10 border-border text-accent-foreground/85 flex h-10.5 w-auto items-center rounded-full border px-3 shadow-xl backdrop-blur-[3px] backdrop-saturate-150 transition-all dark:shadow-lg'
              )}
            >
              <Camera href="/photos" />
              <Github
                href="https://www.github.com/coderking3/king3.me"
                target="_blank"
                rel="noopener noreferrer"
              />
              <ThemeMode enterAnimationDelay={200} />
              <Feed></Feed>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
