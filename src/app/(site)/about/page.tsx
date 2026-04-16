import type { Metadata } from 'next'

import { getT } from '@/i18n/server'
import { AboutPage } from '@/views/about'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.about.title')
  const description = t('metadata.about.description')

  return { title, description, openGraph: { title, description } }
}

export default function Page() {
  return <AboutPage />
}
