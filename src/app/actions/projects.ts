'use server'

import type { Project } from '@/types'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'

import { projectDb } from '@/db/projects'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  link: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  icon: z.union([z.url('Please enter a valid URL'), z.literal('')])
})

export type ProjectInput = z.infer<typeof projectSchema>

export async function getProjectsAction() {
  try {
    const result = await projectDb.queryAll()
    return actionSuccess<Project[]>(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createProjectAction(data: ProjectInput) {
  try {
    await checkAdmin()
    const parsed = projectSchema.parse(data)
    await projectDb.create({ ...parsed })
    revalidatePath('/admin/projects')
    return actionSuccess(null)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  try {
    await checkAdmin()
    const parsed = projectSchema.parse(data)
    await projectDb.update(id, parsed)
    revalidatePath('/admin/projects')
    return actionSuccess(null)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function reorderProjectsAction(ids: string[]) {
  try {
    await checkAdmin()
    const result = await projectDb.reorder(ids)
    revalidatePath('/admin/projects')
    return actionSuccess<Project[]>(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await checkAdmin()
    await projectDb.delete(id)
    revalidatePath('/admin/projects')
    return actionSuccess(null)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function batchDeleteProjectsAction(ids: string[]) {
  try {
    await checkAdmin()
    const count = await projectDb.deleteMany(ids)
    revalidatePath('/admin/projects')
    return actionSuccess<number>(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}
