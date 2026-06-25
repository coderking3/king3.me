import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import { getPoems } from '@/data/poems'
import { PoemsPage } from '@/views/poems'

export async function generateMetadata() {
  const t = await getTranslations('metadata.poems')
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
  const poems = await getPoems()

  return <PoemsPage poems={poems} locale={locale as Locale} />
}
