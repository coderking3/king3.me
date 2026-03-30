import { getUsersAction } from '@/app/actions/users'
import { AdminUsers } from '@/components/blocks'
import { Animated } from '@/components/common'

export default async function AdminUsersPage() {
  const result = await getUsersAction()
  if (!result.success) throw new Error(result.error)

  return (
    <Animated preset="fadeIn">
      <AdminUsers users={result.data} />
    </Animated>
  )
}
