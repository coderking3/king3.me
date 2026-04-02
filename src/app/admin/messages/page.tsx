import { getMessagesAction } from '@/app/actions/messages'
import { MessagesPage } from '@/views/admin'

export default async function Page() {
  const result = await getMessagesAction()
  if (!result.success) throw new Error(result.error)

  return <MessagesPage messages={result.data} />
}
