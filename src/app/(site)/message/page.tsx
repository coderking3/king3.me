import type { Metadata } from 'next'

import { getMessages } from '@/data/messages'
import { getT } from '@/i18n/server'
import { MessagePage } from '@/views/message'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.message.title')
  const description = t('metadata.message.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const messages = (await getMessages()) || []

  return <MessagePage messages={messages} />
}
