import { getUsersAction } from '@/app/actions/users'
import UsersTable from '@/components/blocks/admin/UsersTable'
import { Animated } from '@/components/common'

export default async function AdminUsersPage() {
  const result = await getUsersAction()
  if (!result.success) throw new Error(result.error)

  return (
    <Animated preset="fadeIn">
      <h1 className="mb-4 text-lg font-semibold">Users</h1>
      <UsersTable users={result.data} />
    </Animated>
  )
}
