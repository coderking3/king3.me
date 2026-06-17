import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { UsePage } from '@/views/use'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata() {
  const t = await getTranslations('metadata.use')
  const title = t('title')
  const description = t('description')

  return {
    title,
    description,
    openGraph: {
      title,
      description
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <UsePage locale={locale as Locale} />
}
