import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import { UsePage } from '@/views/use'

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
  } satisfies Metadata
}

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <UsePage locale={locale as Locale} />
}
