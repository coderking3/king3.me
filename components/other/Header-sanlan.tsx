'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useIsTop } from '@/hooks'
import { cn } from '@/lib/utils'

import { Camera, Github, Logo } from '../icons'
import Navbar from '../Navbar'
import ThemeToggle from '../ThemeMode'

// interface ActionLinkProps {
//   children: React.ReactNode
//   href: string
//   type?: 'internal' | 'external'
// }

// function ActionLink({ children, type = 'internal', href }: ActionLinkProps) {
//   const isExternal = type === 'external'

//   const externalProps = {
//     ...(isExternal && {
//       target: '_blank',
//       rel: 'noopener noreferrer'
//     })
//   }

//   return (
//     <Link
//       href={href}
//       className="text-primary bg-background/30 dark:bg-background/50 shadow-primary/5 border-border flex h-9.5 w-10.5 items-center justify-center rounded-[2xl] border shadow-lg backdrop-blur-[1px] backdrop-saturate-150"
//       {...externalProps}
//     >
//       {children}
//     </Link>
//   )
// }

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')
  const isTop = useIsTop(100)

  return (
    <header className="sticky top-0 right-0 left-0 z-50 h-16 w-full pt-4">
      <div className="mx-auto h-full max-w-6xl px-8">
        <div className="flex h-full items-center justify-between">
          {/* Logo - 左 */}
          <div className="flex flex-1 justify-start">
            <Link
              href="/"
              className={cn(
                'text-primary flex items-center justify-center transition-all',
                isTop
                  ? 'size-9.5'
                  : 'bg-background/15 dark:bg-background/30 shadow-primary/5 border-border size-9 rounded-xl border shadow-lg backdrop-blur-[3px] backdrop-saturate-150'
              )}
            >
              <Logo className="box-border size-full p-[3px]"></Logo>
            </Link>
          </div>

          {/* Navbar - 中 */}
          <div className="flex flex-1 items-center justify-center">
            <Navbar page={page}></Navbar>
          </div>
          {/* Actions - 右 */}
          <div
            className={cn(
              'header-actions flex flex-1 items-center justify-end'
            )}
          >
            <div
              className={cn(
                'text-foreground flex h-10 w-auto items-center gap-3 rounded-full px-4 transition-all',
                isTop
                  ? ''
                  : 'bg-background/15 dark:bg-background/30 shadow-primary/5 border-border border shadow-lg backdrop-blur-[3px] backdrop-saturate-150'
              )}
            >
              <Link href="/photos" className="hover:text-primary">
                <Camera className="size-6" />
              </Link>

              <Link
                href="https://www.github.com/coderking3/king3.me"
                type="external"
                className="hover:text-primary"
              >
                <Github className="size-6" />
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
