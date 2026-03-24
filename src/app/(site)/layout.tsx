import React from 'react'

import { Footer, Header } from '@/components/layouts'

export default function SiteLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
