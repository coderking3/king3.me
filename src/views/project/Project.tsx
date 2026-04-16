import type { Project } from '@/types'

import { Animated } from '@/components'
import { getT } from '@/i18n/server'

import ProjectCard from './ProjectCard'

interface ProjectPageProps {
  projects: Project[]
}

async function ProjectPage({ projects }: ProjectPageProps) {
  const { t } = await getT('project')

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {t('title')}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {t('description')}
          </Animated>
        </header>

        <div className="mt-12 sm:mt-20">
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3"
          >
            {projects.map((project, index) => (
              <ProjectCard idx={index} key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage
