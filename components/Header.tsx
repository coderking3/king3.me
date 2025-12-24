'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Camera, Github, Logo } from './icons'
import Navbar from './Navbar'

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

function Header() {
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')

  return (
    <header className="sticky top-0 right-0 left-0 z-10 h-16 w-full pt-6">
      <div className="mx-auto h-full max-w-7xl px-2">
        <div className="flex h-full items-center justify-between">
          <div className="flex flex-1 justify-start">
            <Link href="/">
              <Logo className="size-10"></Logo>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <Navbar page={page}></Navbar>
          </div>

          <div className="header-actions flex flex-1 items-center justify-end gap-2">
            <ActionLink href="/photos">
              <Camera className="size-7" />
            </ActionLink>

            <ActionLink
              href="https://www.github.com/coderking3/king3.me"
              type="external"
            >
              <Github className="size-7" />
            </ActionLink>

            {/* <Button
              variant="outline"
              size="icon"
              className="size-8 border-transparent hover:bg-transparent"
            >
              <SunAndMoon className="size-7"></SunAndMoon>
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
