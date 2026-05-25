import type { Project } from '@/types'
import type { ProjectInput } from '@/validations/projects'

import { createCachedQuery } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

import 'server-only'

const getProjectsFn = async (): Promise<Project[]> => {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      link: true,
      icon: true,
      order: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { order: 'asc' }
  })

  return projects.map((project) => ({
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }))
}

export const { query: getProjects, revalidate: revalidateProjects } =
  createCachedQuery(getProjectsFn, 'projects', 'days')

export async function createProject(data: ProjectInput) {
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } })

  return prisma.project.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 }
  })
}

export async function updateProject(id: string, data: ProjectInput) {
  return prisma.project.update({ where: { id }, data })
}

export async function reorderProjects(ids: string[]) {
  const currentProjects = await prisma.project.findMany({
    select: { id: true }
  })

  if (currentProjects.length !== ids.length) {
    throw new Error('Project reorder payload is incomplete.')
  }

  const currentIdSet = new Set(currentProjects.map((p) => p.id))
  if (
    ids.some((id) => !currentIdSet.has(id)) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error('Project reorder payload is invalid.')
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { order: index }
      })
    )
  )

  return getProjects()
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } })
}

export async function deleteProjects(ids: string[]) {
  const { count } = await prisma.project.deleteMany({
    where: { id: { in: ids } }
  })

  const remaining = await prisma.project.findMany({
    select: { id: true },
    orderBy: { order: 'asc' }
  })

  if (remaining.length > 0) {
    await prisma.$transaction(
      remaining.map((project, index) =>
        prisma.project.update({
          where: { id: project.id },
          data: { order: index }
        })
      )
    )
  }

  return count
}
