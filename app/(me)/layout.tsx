import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { Audiowide, Geist, Geist_Mono } from 'next/font/google' // 1. 引入 Geist 字体
import React from 'react'

import { Background, Footer, Header, Main } from '@/components/index'
import { Toaster } from '@/components/ui'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'

/* 配置字体实例 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})
const GoogleArt = Audiowide({
  weight: '400',
  variable: '--font-google-art',
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
    icon: '/icons/favicon.svg'
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
      className={cn(geistSans.variable, geistMono.variable, GoogleArt.variable)}
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
            <Main>{children}</Main>
            <Footer />
          </div>

          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
