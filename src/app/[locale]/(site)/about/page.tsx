import { getTranslations } from 'next-intl/server'

import { AboutPage } from '@/views/about'

export async function generateMetadata() {
  const t = await getTranslations('metadata.about')
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

export default function Page() {
  return <AboutPage />
}
