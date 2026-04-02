import { getUsersAction } from '@/app/actions/users'
import { UsersPage } from '@/views/admin'

export default async function Page() {
  const result = await getUsersAction()
  if (!result.success) throw new Error(result.error)

  return <UsersPage users={result.data} />
}
