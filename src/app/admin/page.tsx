import { getDashboardData } from '@/db/dashboard'
import { DashboardPage } from '@/views/admin'

export default async function Page() {
  const data = await getDashboardData()

  return <DashboardPage data={data} />
}
