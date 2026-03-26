import { getProjectsAction } from '@/app/actions/projects'
import { AdminProjects } from '@/components/blocks'
import { Animated } from '@/components/common'

export default async function AdminProjectsPage() {
  const result = await getProjectsAction()
  if (!result.success) throw new Error(result.error)

  return (
    <Animated preset="fadeIn">
      <AdminProjects projects={result.data} />
    </Animated>
  )
}
