import type { Metadata } from 'next'

import { ThemeProvider } from 'next-themes'
import { headers } from 'next/headers'
import * as React from 'react'

import { Toaster } from '@/components/ui'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getT } from '@/i18n/server'
import { FALLBACK_LNG, HEADER_NAME } from '@/i18n/settings'
import { audioWide, robotoMono } from '@/lib/font'
import { cn } from '@/lib/utils'

import '@/styles/global.css'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = 'King3 | Developer、Storyteller'
  const description = t('metadata.root.description')

  return {
    title: {
      default: title,
      template: '%s - King3'
    },
    description,
    keywords: 'King3,CoderKing3,Developer,Storyteller',
    openGraph: {
      title: {
        default: title,
        template: '%s - King3'
      },
      description,
      siteName: 'King3',
      locale: 'en',
      type: 'website',
      url: 'https://king3-me.vercel.app'
    }
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const headerList = await headers()
  const lang = headerList.get(HEADER_NAME) ?? FALLBACK_LNG

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(robotoMono.variable, audioWide.variable)}
    >
      <body className="min-h-screen scroll-smooth antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}

            <Toaster position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
