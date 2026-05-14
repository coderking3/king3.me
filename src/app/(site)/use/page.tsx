import type { Metadata } from 'next'

import { getT } from '@/i18n/server'
import { UsePage } from '@/views/use'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.use.title')
  const description = t('metadata.use.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  return <UsePage />
}
