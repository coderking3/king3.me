'use client'

import React from 'react'

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="mx-auto h-200 max-w-6xl px-4 sm:px-8">{children}</div>
    </main>
  )
}

export default Main
