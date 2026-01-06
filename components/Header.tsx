'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Camera, Github, Logo, ThemeMode } from './icons'
import Navbar from './Navbar'

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
              <Link
                href="/"
                className={cn('flex size-8.5 items-center justify-center')}
              >
                <Logo variant="bold" className="box-border size-full p-[3px]" />
              </Link>

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
              <Link
                href="/photos"
                className="hover:text-accent-foreground transition-colors duration-200"
              >
                <Camera className="h-10.5 w-8.5 px-1.5" />
              </Link>

              <Link
                href="https://www.github.com/coderking3/king3.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-foreground transition-colors duration-200"
              >
                <Github className="h-10.5 w-8.5 px-1.5" />
              </Link>

              <ThemeMode />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
