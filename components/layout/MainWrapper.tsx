import React from 'react'

function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8">{children}</div>
    </main>
  )
}

export default MainWrapper
