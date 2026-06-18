import { getTranslations } from 'next-intl/server'

import { getMessages } from '@/data/messages'
import { MessagePage } from '@/views/message'

export async function generateMetadata() {
  const t = await getTranslations('metadata.message')
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

export default async function Page() {
  const messages = (await getMessages()) || []

  return <MessagePage messages={messages} />
}
