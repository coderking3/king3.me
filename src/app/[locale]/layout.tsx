import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

import { ThemeProvider } from '@/components/common'
import { Toaster } from '@/components/ui'
import { TooltipProvider } from '@/components/ui/tooltip'
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

  return {
    title: {
      default: t('titleDefault'),
      template: `%s - ${name}`
    },
    description: t('description'),
    keywords: 'King3,CoderKing3,Developer,Storyteller',
    openGraph: {
      title: t('titleDefault'),
      description: t('description'),
      siteName: name,
      type: 'website',
      url: 'https://king3-me.vercel.app'
    }
  }
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
      className={cn(robotoMono.variable, audioWide.variable, 'scroll-smooth')}
    >
      <body className="min-h-screen">
        <NextIntlClientProvider>
          <ThemeProvider>
            <TooltipProvider>
              {/* <Suspense fallback={null}>{children}</Suspense> */}
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
