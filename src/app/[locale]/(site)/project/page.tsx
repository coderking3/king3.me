import { getTranslations } from 'next-intl/server'

import { getProjects } from '@/data/projects'
import { ProjectPage } from '@/views/project'

export async function generateMetadata() {
  const t = await getTranslations('metadata.project')
  const title = t('title')
  const description = t('description')

  return {
    title,
    description,
    openGraph: {
      title,
      description
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default async function Page() {
  const projects = await getProjects()

  return <ProjectPage projects={projects} />
}
