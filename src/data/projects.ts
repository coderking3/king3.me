import type { Project } from '@/types'
import type { ProjectInput } from '@/validations/projects'

import { asc, eq, inArray, max } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

import { db } from '@/lib/db'
import { project } from '@/lib/db/schema'

import 'server-only'

export async function getProjects(): Promise<Project[]> {
  'use cache'
  cacheLife('days')
  cacheTag('projects')

  const projects = await db
    .select({
      id: project.id,
      name: project.name,
      description: project.description,
      link: project.link,
      icon: project.icon,
      order: project.order,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    })
    .from(project)
    .orderBy(asc(project.order))

  return projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }))
}

export function invalidateProjects() {
  updateTag('projects')
}

export async function createProject(data: ProjectInput) {
  const [{ maxOrder }] = await db
    .select({ maxOrder: max(project.order) })
    .from(project)

  const [created] = await db
    .insert(project)
    .values({ ...data, order: (maxOrder ?? -1) + 1 })
    .returning()

  return created
}

export async function updateProject(id: string, data: ProjectInput) {
  const [updated] = await db
    .update(project)
    .set(data)
    .where(eq(project.id, id))
    .returning()
  return updated
}

export async function reorderProjects(ids: string[]) {
  const currentProjects = await db.select({ id: project.id }).from(project)

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

  await db.transaction(async (tx) => {
    for (const [index, id] of ids.entries()) {
      await tx.update(project).set({ order: index }).where(eq(project.id, id))
    }
  })

  return getProjects()
}

export async function deleteProject(id: string) {
  const [deleted] = await db
    .delete(project)
    .where(eq(project.id, id))
    .returning()
  return deleted
}

export async function deleteProjects(ids: string[]) {
  const deleted = await db
    .delete(project)
    .where(inArray(project.id, ids))
    .returning({ id: project.id })

  const count = deleted.length

  const remaining = await db
    .select({ id: project.id })
    .from(project)
    .orderBy(asc(project.order))

  if (remaining.length > 0) {
    await db.transaction(async (tx) => {
      for (const [index, { id }] of remaining.entries()) {
        await tx.update(project).set({ order: index }).where(eq(project.id, id))
      }
    })
  }

  return count
}
