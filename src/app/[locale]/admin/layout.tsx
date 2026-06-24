import type { Metadata } from 'next'

import { Suspense } from 'react'

import {
  AdminHeader,
  AdminHeaderSkeleton,
  AdminSidebar,
  AdminSidebarSkeleton
} from '@/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { requireServerAdminSession } from '@/lib/auth-session'

export const metadata: Metadata = {
  robots: { index: false, follow: false }
}

interface AdminLayoutProps {
  children: React.ReactNode
}

const SIDEBAR_STYLE = {
  '--sidebar-width': '14.5rem',
  '--header-height': '3.5rem'
} as React.CSSProperties

function AdminLayoutSkeleton() {
  return (
    <div
      className="bg-background relative flex min-h-svh"
      style={SIDEBAR_STYLE}
    >
      <AdminSidebarSkeleton />
      <main className="flex flex-1 flex-col pl-[14.5rem]">
        <AdminHeaderSkeleton />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

async function AdminLayoutContent({ children }: AdminLayoutProps) {
  const session = await requireServerAdminSession()

  return (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <AdminSidebar user={session.user} variant="inset" />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  )
}
