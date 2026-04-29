import { getProjectsAction } from '@/actions/projects'
import { ProjectsPage } from '@/views/admin'

export default async function Page() {
  const result = await getProjectsAction()

  return <ProjectsPage projects={result.data || []} />
}
