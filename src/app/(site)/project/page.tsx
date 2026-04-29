import type { Metadata } from 'next'

import { getProjectsAction } from '@/actions/projects'
import { getT } from '@/i18n/server'
import { ProjectPage } from '@/views/project'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.project.title')
  const description = t('metadata.project.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const result = await getProjectsAction()

  return <ProjectPage projects={result.data || []} />
}

export const revalidate = 3600
