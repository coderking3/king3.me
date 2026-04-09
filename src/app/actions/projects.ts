'use server'

import type { ProjectInput } from '@/lib/schemas'

import { revalidatePath } from 'next/cache'

import { projectDb } from '@/db/projects'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'
import { projectSchema } from '@/lib/schemas'

export async function getProjectsAction() {
  try {
    const result = await projectDb.queryAll()
    return actionSuccess(result)
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
    return actionSuccess(undefined)
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
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function reorderProjectsAction(ids: string[]) {
  try {
    await checkAdmin()
    const result = await projectDb.reorder(ids)
    revalidatePath('/admin/projects')
    return actionSuccess(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await checkAdmin()
    await projectDb.delete(id)
    revalidatePath('/admin/projects')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}
