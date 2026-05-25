import { getProjects } from '@/data/projects'
import { createPageMetadata } from '@/lib/metadata'
import { ProjectPage } from '@/views/project'

export const metadata = createPageMetadata('project')

export default async function Page() {
  const projects = await getProjects()

  return <ProjectPage projects={projects} />
}

export const revalidate = 3600
