import type { Metadata } from 'next'

import { projectDb } from '@/db/projects'
import { description, ProjectPage, title } from '@/views/project'

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description
  }
} satisfies Metadata

export default async function Page() {
  const projects = await projectDb.queryAll()
  return <ProjectPage projects={projects} />
}

export const revalidate = 3600
