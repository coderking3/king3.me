import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import { AuthPage } from '@/views/auth'

export async function generateMetadata() {
  const t = await getTranslations('metadata.auth')
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

export default function Page() {
  return <AuthPage />
}
