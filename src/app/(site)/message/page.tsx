import type { Metadata } from 'next'

import { messageDb } from '@/db/messages'
import { description, MessagePage, title } from '@/views/message'

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description
  }
} satisfies Metadata

export default async function Page() {
  const messages = await messageDb.queryAll()
  return <MessagePage messages={messages} />
}
