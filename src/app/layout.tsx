import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { Roboto_Mono } from 'next/font/google' // 引入 字体
import localFont from 'next/font/local'
import React from 'react'

import { Background, Footer, Header } from '@/components/layouts'
import { Toaster } from '@/components/ui'
import { cn } from '@/lib/utils'

import '@/styles/global.css'

// Audiowide 使用本地子集字体
const audioWide = localFont({
  src: '../../public/fonts/Audiowide-King3.woff2',
  variable: '--font-audiowide',
  weight: '400',
  display: 'swap',
  preload: true // 文件很小,可以预加载
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono'
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
