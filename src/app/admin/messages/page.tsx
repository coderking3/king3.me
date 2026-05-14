import { getMessages } from '@/data/messages'
import { MessagesPage } from '@/views/admin'

export default async function Page() {
  const messages = (await getMessages()) || []

  return <MessagesPage messages={messages} />
}
