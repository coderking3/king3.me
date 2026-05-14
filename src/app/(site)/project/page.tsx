import type { Metadata } from 'next'

import { getProjects } from '@/data/projects'
import { getT } from '@/i18n/server'
import { ProjectPage } from '@/views/project'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.project.title')
  const description = t('metadata.project.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const projects = await getProjects()

  return <ProjectPage projects={projects} />
}

export const revalidate = 3600
