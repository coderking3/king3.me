import { getUsers } from '@/data/users'
import { UsersPage } from '@/views/admin'

export default async function Page() {
  const users = (await getUsers()) || []

  return <UsersPage users={users} />
}
