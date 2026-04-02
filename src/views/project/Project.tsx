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
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <Animated as="header" preset="fadeInUp" className="max-w-2xl">
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-foreground/80 mt-6 text-lg">{description}</p>
        </Animated>

        <div className="mt-16 sm:mt-20">
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
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
