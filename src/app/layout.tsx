import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import React from 'react'

import { Background, Footer, Header } from '@/components/layouts'
import { Toaster } from '@/components/ui'
import { audioWide, robotoMono } from '@/lib/font'
import { cn } from '@/lib/utils'

import '@/styles/global.css'

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
      className={cn(robotoMono.variable, audioWide.variable)}
    >
      <body className={cn('min-h-screen scroll-smooth antialiased', '')}>
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
