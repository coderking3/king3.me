import { getProjectsAction } from '@/app/actions/projects'
import Projects from '@/components/blocks/admin/Projects'
import { Animated } from '@/components/common'

export default async function AdminProjectsPage() {
  const result = await getProjectsAction()
  if (!result.success) throw new Error(result.error)

  return (
    <Animated preset="fadeIn">
      <Projects projects={result.data} />
    </Animated>
  )
}
