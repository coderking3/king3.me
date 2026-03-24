'use client'

import { FolderKanban, MessageSquare, Music, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LogoIcon } from '@/icons'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/playlist', label: 'Playlist', icon: Music },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban }
]

function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-border flex w-60 shrink-0 flex-col border-r">
      <div className="text-accent-foreground flex h-14 items-center gap-2 px-6 select-none">
        <LogoIcon size={30} variant="bold"></LogoIcon>
        <span className="text-lg font-semibold">King3 Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar
