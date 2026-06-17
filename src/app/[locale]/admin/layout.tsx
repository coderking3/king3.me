import { Suspense } from 'react'

import { AdminHeader, AdminSidebar } from '@/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { requireServerAdminSession } from '@/lib/auth-session'

interface AdminLayoutProps {
  children: React.ReactNode
}

const SIDEBAR_STYLE = {
  '--sidebar-width': '14.5rem',
  '--header-height': '3.5rem'
} as React.CSSProperties

function AdminSidebarSkeleton() {
  return (
    <aside
      className="border-border bg-background fixed top-0 left-0 z-40 flex h-svh w-[14.5rem] flex-col border-r"
      aria-hidden="true"
    >
      <div className="flex h-[3.5rem] items-center border-b px-4">
        <Skeleton className="h-6 w-28" />
      </div>
      <nav className="flex-1 space-y-2 p-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    </aside>
  )
}

function AdminHeaderSkeleton() {
  return (
    <header className="border-border flex h-[3.5rem] items-center justify-between border-b px-4">
      <Skeleton className="h-5 w-32" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-8" />
        <Skeleton className="size-8 rounded-full" />
      </div>
    </header>
  )
}

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
