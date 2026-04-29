import { getUsersAction } from '@/actions/users'
import { UsersPage } from '@/views/admin'

export default async function Page() {
  const result = await getUsersAction()

  return <UsersPage users={result.data || []} />
}
