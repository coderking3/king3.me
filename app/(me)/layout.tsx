import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google' // 1. 引入 Geist 字体
import React from 'react'
import { Toaster } from 'sonner'

import { Background, Footer, Header, Main } from '@/components/index'
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
      className={cn(geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-screen font-sans antialiased selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black">
        {/* <body className="bg-background min-h-screen font-sans antialiased selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black"> */}
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

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
