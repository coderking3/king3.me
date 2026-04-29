import { getMessagesAction } from '@/actions/messages'
import { MessagesPage } from '@/views/admin'

export default async function Page() {
  const result = await getMessagesAction()

  return <MessagesPage messages={result.data || []} />
}
