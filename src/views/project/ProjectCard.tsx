'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Animated } from '@/components'
import { STAGGER } from '@/constants'
import { useInteractive } from '@/icons'
import { ExternalLinkIcon } from '@/icons/ExternalLink'

interface Project {
  name: string
  description: string
  link: string
  icon: string
}

const ICON_SIZE = 120

interface ProjectCardProps {
  idx: number
  project: Project
}

function ProjectCard(props: ProjectCardProps) {
  const { idx, project } = props
  const { isHovered, handlers } = useInteractive()

  return (
    <Animated
      as="li"
      preset={{ mode: 'fadeInUp', delay: STAGGER.base + idx * STAGGER.step }}
      className="border-border group relative flex flex-col items-start justify-between rounded-xl border border-dashed p-4 pb-3 md:border-0 md:p-0"
      {...handlers}
    >
      <div className="z-20">
        <Image
          className="size-12"
          width={ICON_SIZE}
          height={ICON_SIZE}
          src={`${project.icon}@${ICON_SIZE}w_${ICON_SIZE}h_1e_1c.webp`}
          alt={project.name}
        ></Image>

        <h2 className="text-primary mt-3 text-base font-semibold md:mt-6">
          <Link href={project.link} target="_blank">
            <span className="absolute inset-0 z-20 md:-inset-x-6 md:-inset-y-6 md:rounded-2xl" />
            {project.name}
          </Link>
        </h2>
        <p className="text-muted-foreground z-20 mt-2 text-sm">
          {project.description}
        </p>
      </div>

      {/* Desktop: dashed hover border + background */}
      <div className="border-border bg-secondary/80 absolute -inset-x-6 -inset-y-6 z-0 hidden scale-95 rounded-xl border border-dashed opacity-0 transition md:block md:group-hover:scale-100 md:group-hover:opacity-100" />

      <p className="text-brand md:text-foreground/90 md:group-hover:text-brand pointer-events-none z-20 mt-3 flex items-center text-sm font-medium transition md:mt-6 md:group-hover:-translate-y-0.5">
        <span className="mr-2">{new URL(project.link).host}</span>
        <ExternalLinkIcon isHovered={isHovered} size={16} />
      </p>
    </Animated>
  )
}

export default ProjectCard
