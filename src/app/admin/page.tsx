import { dashboardDb } from '@/db'
import { DashboardPage } from '@/views/admin'

export default async function Page() {
  const data = await dashboardDb.query()

  return <DashboardPage data={data} />
}
