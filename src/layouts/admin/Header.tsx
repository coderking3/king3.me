'use client'

import { usePathname } from 'next/navigation'

import { ThemeMode } from '@/components'
import { Separator, SidebarTrigger } from '@/components/ui'

import { navItems } from './Sidebar'

function AdminHeader() {
  const pathname = usePathname()
  const title =
    navItems.find((item) => item.href === pathname)?.label ?? 'Admin'

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear md:h-14">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeMode />
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
