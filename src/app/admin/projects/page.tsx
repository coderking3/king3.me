import { getProjectsAction } from '@/app/actions/projects'
import { ProjectsPage } from '@/views/admin'

export default async function Page() {
  const result = await getProjectsAction()
  if (!result.success) throw new Error(result.error)

  return <ProjectsPage projects={result.data} />
}
