import { ThemeProvider } from 'next-themes'
import * as React from 'react'

import { Toaster } from '@/components/ui'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DEFAULT_LNG } from '@/i18n/settings'
import { audioWide, robotoMono } from '@/lib/font'
import { createRootMetadata } from '@/lib/metadata'
import { cn } from '@/lib/utils'

import '@/styles/global.css'

export const metadata = createRootMetadata()

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={DEFAULT_LNG}
      suppressHydrationWarning
      className={cn(robotoMono.variable, audioWide.variable, 'scroll-smooth')}
    >
      <body className="min-h-screen">
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
