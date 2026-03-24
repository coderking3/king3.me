'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ThemeMode } from '@/components/common'

interface AdminHeaderProps {
  user: {
    name: string
    image?: string | null
  }
}

function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="border-border flex h-14 items-center justify-between border-b px-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to site
      </Link>

      <div className="flex items-center gap-3">
        <ThemeMode />

        <div className="flex items-center gap-2">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
