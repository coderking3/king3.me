import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { Audiowide, Noto_Sans_SC, Roboto, Roboto_Mono } from 'next/font/google' // 1. 引入 Geist 字体
import React from 'react'

// import { Roboto, Roboto_Mono } from 'next/font/google'
import { Background, Footer, Header } from '@/components/layouts'
import { Toaster } from '@/components/ui'
import { cn } from '@/lib/utils'

import './globals.css'

const audioWide = Audiowide({
  weight: '400',
  variable: '--font-audiowide',
  subsets: ['latin']
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono'
})
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-noto-sans'
})

// const pingFang = localFont({
//   src: [
//     {
//       path: 'https://cdn.jsdelivr.net/npm/font-pingfang-sc@1.0.5/PingFangSC-Regular.woff2',
//       weight: '400',
//       style: 'normal'
//     },
//     {
//       path: 'https://cdn.jsdelivr.net/npm/font-pingfang-sc@1.0.5/PingFangSC-Medium.woff2',
//       weight: '500',
//       style: 'normal'
//     }
//   ],
//   variable: '--font-pingfang',
//   display: 'swap'
// })

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
      className={cn(
        roboto.variable,
        robotoMono.variable,
        notoSansSC.variable,
        audioWide.variable
      )}
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
