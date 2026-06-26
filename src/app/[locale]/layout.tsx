// layout.tsx
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

import { ThemeProvider } from '@/components/common'
import { Toaster } from '@/components/ui'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PROFILE, SITE_NAME, SITE_URL } from '@/constants'
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

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const language = locale === 'zh' ? 'zh_CN' : 'en_US'

  const t = await getTranslations()
  const title = t('metadata.site.titleDefault')
  const description = t('metadata.site.description')
  const rssFeed = t('ui.actions.rssFeed')

  return {
    metadataBase: SITE_URL,
    title: {
      default: title,
      template: `%s - ${SITE_NAME}`
    },
    description,
    keywords: 'King3,CoderKing3,Developer,Open Source,开发者,开源作者,细节控',
    manifest: '/site.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'King3'
    },
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
      title: {
        default: title,
        template: `%s - ${SITE_NAME}`
      },
      description,
      siteName: SITE_NAME,
      locale: language,
      type: 'website',
      url: SITE_URL
    },
    twitter: {
      site: PROFILE.twitter.name,
      creator: PROFILE.twitter.name,
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': [{ url: 'rss', title: rssFeed }]
      }
    }
  } satisfies Metadata
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
      <body className="min-h-screen pt-[env(safe-area-inset-top)]">
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
