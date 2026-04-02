'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui'
import { NAVIGATION_ITEMS } from '@/constants'
import { Feed } from '@/icons'
import { cn } from '@/lib/utils'

function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const page = pathname.split('/').slice(0, 2).join('/')

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
            {NAVIGATION_ITEMS.map(({ name, href }) => {
              const isActive =
                (page.includes(href) && href !== '/') || page === href

              return (
                <li key={name}>
                  <Link
                    href={href}
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

        <SheetFooter className="flex-row items-center gap-1 border-t px-4">
          <Feed href="/feed.xml" target="_blank" rel="noopener noreferrer" />
          <span className="text-muted-foreground text-sm">RSS Feed</span>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
