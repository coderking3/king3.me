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

  return {
    title: {
      default: 'King3',
      template: '%s - King3'
    },
    description: t('metadata.root.description'),
    icons: {
      icon: '/icons/favicon.svg'
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
