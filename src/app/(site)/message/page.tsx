import { getMessages } from '@/data/messages'
import { createPageMetadata } from '@/lib/metadata'
import { MessagePage } from '@/views/message'

export const metadata = createPageMetadata('message')

export default async function Page() {
  const messages = (await getMessages()) || []

  return <MessagePage messages={messages} />
}
