'use client'

import React from 'react'

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-8 py-4">{children}</div>
    </main>
  )
}

export default Main
