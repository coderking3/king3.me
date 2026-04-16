import type { Metadata } from 'next'

import { getPoemsAction } from '@/app/actions/poems'
import { getT } from '@/i18n/server'
import { PoemsPage } from '@/views/poems'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.poems.title')
  const description = t('metadata.poems.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const result = await getPoemsAction()
  if (!result.success) throw new Error(result.error)

  throw new Error('666')

  return <PoemsPage poems={result.data} />
}
