import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { Audiowide, Geist, Geist_Mono } from 'next/font/google' // 1. 引入 Geist 字体
import React from 'react'

import { Background, Footer, Header } from '@/components/layouts'
import { Toaster } from '@/components/ui'
import { cn } from '@/lib/utils'

import './globals.css'

const audioWide = Audiowide({
  weight: '400',
  variable: '--font-google-audiowide',
  subsets: ['latin']
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

/* 配置元数据 */
export const metadata: Metadata = {
  title: {
    default: 'King3.me',
    template: '%s | King3.me'
  },
  description: 'Frontend Developer & Music Enthusiast',
  icons: {
    icon: '/favicon.svg'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable, audioWide.variable)}
    >
      <body
        className={cn('min-h-screen scroll-smooth font-sans antialiased', '')}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background art="random" />

          {/* container */}
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
