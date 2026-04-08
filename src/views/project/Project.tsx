import type { Project } from '@/types'

import { Animated } from '@/components'

import ProjectCard from './ProjectCard'

export const title = 'My Projects'
export const description = 'These are all my projects and libraries.'

interface ProjectPageProps {
  projects: Project[]
}

function ProjectPage({ projects }: ProjectPageProps) {
  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {title}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {description}
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
