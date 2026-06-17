import { getProjects } from '@/data/projects'
import { ProjectsPage } from '@/views/admin'

export default async function Page() {
  const projects = (await getProjects()) || []

  return <ProjectsPage projects={projects} />
}
