'use client'

import type { Project } from '@/data/projects'

// import { ExternalLinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useInteractive } from '@/icons'
import { ExternalLinkIcon } from '@/icons/ExternalLink'

function ProjectCard(props: { project: Project }) {
  const { project } = props
  const { isHovered, handlers } = useInteractive()

  return (
    <li
      className="group relative flex flex-col items-start justify-between"
      {...handlers}
    >
      <div className="z-20">
        <Image
          className="size-12"
          width={48}
          height={48}
          src={project.icon}
          alt={project.name}
        ></Image>

        <h2 className="text-primary mt-6 text-base font-semibold">
          <Link href={project.link} target="_blank">
            <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
            {project.name}
          </Link>
        </h2>
        <p className="text-muted-foreground z-20 mt-2 text-sm">
          {project.description}
        </p>
      </div>

      <div className="border-border bg-secondary/80 absolute -inset-x-4 -inset-y-6 z-0 scale-95 border border-dashed opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />

      <p className="group-hover:text-brand text-foreground/90 pointer-events-none z-20 mt-6 flex items-center text-sm font-medium transition group-hover:-translate-y-0.5">
        <span className="mr-2">{new URL(project.link).host}</span>
        <ExternalLinkIcon isHovered={isHovered} size={16} />
      </p>
    </li>
  )
}

export default ProjectCard
