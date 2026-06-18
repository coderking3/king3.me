// layout.tsx
import type { Viewport } from 'next'
import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

import { ThemeProvider } from '@/components/common'
import { Toaster } from '@/components/ui'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SITE_URL } from '@/constants'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

import '@/styles/global.css'

const audioWide = localFont({
  src: '../../../public/fonts/Audiowide-King3.woff2',
  variable: '--font-audiowide',
  weight: '400',
  display: 'swap',
  preload: true
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono'
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata() {
  const t = await getTranslations('metadata.site')
  const name = 'King3'
  const title = t('titleDefault')
  const description = t('description')

  return {
    metadataBase: SITE_URL,
    title: {
      default: title,
      template: `%s - ${name}`
    },
    description,
    keywords: 'King3,CoderKing3,Developer,Storyteller',
    // manifest: '/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    openGraph: {
      title,
      description,
      siteName: name,
      type: 'website',
      url: SITE_URL
    }
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0f11' }
  ],
  width: 'device-width',
  initialScale: 1
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(robotoMono.variable, audioWide.variable)}
    >
      <body className="min-h-screen">
        <NextIntlClientProvider>
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
