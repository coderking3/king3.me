import { getMessagesAction } from '@/app/actions/messages'
import { AdminMessages } from '@/components/blocks'
import { Animated } from '@/components/common'

export default async function AdminMessagesPage() {
  const result = await getMessagesAction()
  if (!result.success) throw new Error(result.error)

  return (
    <Animated preset="fadeIn">
      <AdminMessages messages={result.data} />
    </Animated>
  )
}
