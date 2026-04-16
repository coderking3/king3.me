import React from 'react'

import { Background, Footer, Header } from '@/layouts'

export default function SiteLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Background art="random" />

      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
