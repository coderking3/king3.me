'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Camera, Github, Logo } from './icons'
import Navbar from './Navbar'
import ThemeToggle from './ThemeToggle'

interface ActionLinkProps {
  children: React.ReactNode
  href: string
  type?: 'internal' | 'external'
}

function ActionLink({ children, type = 'internal', href }: ActionLinkProps) {
  const isExternal = type === 'external'

  const externalProps = {
    ...(isExternal && {
      target: '_blank',
      rel: 'noopener noreferrer'
    })
  }

  return (
    <Link
      href={href}
      className="flex size-8 items-center justify-center"
      {...externalProps}
    >
      {children}
    </Link>
  )
}

interface HeaderBackgroundProps {
  isTop: boolean
}
function HeaderBackground({ isTop }: HeaderBackgroundProps) {
  return (
    <motion.div
      className={cn(
        'absolute top-1/2 -z-20 h-11 -translate-y-1/2 rounded-full',
        'bg-background/50 dark:bg-background/70 shadow-primary/5 dark:shadow-primary/0 shadow-xl',
        'backdrop-blur-[3px] backdrop-saturate-150',
        'border-border border'
      )}
      animate={{
        left: !isTop ? '0' : '33.33%',
        right: !isTop ? '0' : '33.33%'
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}

      // style={{

      // }}
    />

    //  <motion.div
    //     className="absolute top-1/2 -translate-y-1/2 -z-10 h-11 rounded-full"
    //     animate={{
    //       // 顶部时：只覆盖中间 33.33%
    //       left: isScrolled ? '0' : '33.33%',
    //       right: isScrolled ? '0' : '33.33%',
    //       // 或者用 width + left 的方式
    //       // left: isScrolled ? '0' : '50%',
    //       // width: isScrolled ? '100%' : 'auto',
    //       // transform: isScrolled ? 'translateY(-50%)' : 'translate(-50%, -50%)',
    //     }}
    //     style={{
    //       backgroundColor: 'hsl(var(--background) / 0.5)',
    //       backdropFilter: 'blur(3px) saturate(150%)',
    //       border: '1px solid hsl(var(--border))',
    //       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    //     }}
    // transition={{
    //   type: 'spring',
    //   stiffness: 300,
    //   damping: 30,
    // }}
    //   />
  )
}

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')
  // const isTop = useIsTop(100)

  return (
    <header className="sticky top-0 right-0 left-0 z-10 h-16 w-full pt-6">
      <div className="mx-auto h-full max-w-6xl px-2">
        <div className="relative flex h-full items-center justify-between px-4">
          {/* 玻璃态背景层 */}
          {/* <HeaderBackground isTop={isTop} /> */}

          {/* Logo - 左 */}
          <div className="flex flex-1 justify-start">
            <Link href="/">
              <Logo className="size-8"></Logo>
            </Link>
          </div>

          {/* Navbar - 中 */}
          <div className="flex flex-1 items-center justify-center">
            <Navbar page={page}></Navbar>
          </div>

          {/* Actions - 右 */}
          <div className="text-foreground header-actions flex flex-1 items-center justify-end gap-2">
            <ActionLink href="/photos">
              <Camera className="size-6" />
            </ActionLink>

            <ActionLink
              href="https://www.github.com/coderking3/king3.me"
              type="external"
            >
              <Github className="size-6" />
            </ActionLink>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
