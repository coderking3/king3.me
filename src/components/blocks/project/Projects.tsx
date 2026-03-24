import { prisma } from '@/lib/prisma'

import ProjectCard from './ProjectCard'

async function Projects() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  )
}

export default Projects
