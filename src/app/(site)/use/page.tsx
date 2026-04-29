import type { Metadata } from 'next'

import { getT } from '@/i18n/server'
import { getUseContent } from '@/lib/posts'
import { UsePage } from '@/views/use'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.use.title')
  const description = t('metadata.use.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const { lang } = await getT('common')
  const { content, headings } = await getUseContent(lang)

  return <UsePage content={content} headings={headings} />
}
