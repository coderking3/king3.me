import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google' // 1. 引入 Geist 字体
import React from 'react'
import { Toaster } from 'sonner'

import { Footer, Header, MainWrapper } from '@/components/layout'
import { cn } from '@/lib/utils'

import '../../styles/globals.css'

// 2. 配置字体实例
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    default: 'King3.me',
    template: '%s | King3.me'
  },
  description: 'Frontend Developer & UI Design Enthusiast',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'bg-background min-h-screen font-sans antialiased selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
          </div>
          {/* 
           <div className="flex flex-col items-center px-4 pt-10 mx-auto max-w-4xl lg:max-w-5xl sm:px-12 md:px-20 lg:px-12 xl:max-w-7xl min-h-svh">
            <Header />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
          </div>
          */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
