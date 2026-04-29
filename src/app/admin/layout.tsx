import { redirect } from 'next/navigation'
import * as React from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AdminHeader, AdminSidebar } from '@/layouts/admin'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/auth')

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '14.5rem',
          '--header-height': '3.5rem'
        } as React.CSSProperties
      }
    >
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
