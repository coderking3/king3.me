import type { Metadata } from 'next'

import { getPoems } from '@/data/poems'
import { getT } from '@/i18n/server'
import { PoemsPage } from '@/views/poems'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.poems.title')
  const description = t('metadata.poems.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const poems = await getPoems()

  return <PoemsPage poems={poems} />
}
