import { redirect } from 'next/navigation'
import React from 'react'

import { AdminHeader, AdminSidebar } from '@/components/layouts'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/auth')

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={session.user} />

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
