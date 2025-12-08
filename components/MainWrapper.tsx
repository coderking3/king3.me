'use client'

import React from 'react'

import Background from './Background'

interface MainWrapperProps {
  children: React.ReactNode
}

export default function MainWrapper({ children }: MainWrapperProps) {
  return (
    <>
      <main className="flex-1">
        <Background art="snow" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          {children}
        </div>
      </main>
    </>
  )
}
