'use server'

import type { Project } from '@/types'
import type { ProjectInput } from '@/validations/projects'

import {
  createProject,
  deleteProject,
  deleteProjects,
  reorderProjects,
  updateProject
} from '@/data/projects'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { revalidatePaths } from '@/lib/revalidate'
import { idSchema, idsSchema } from '@/validations/common'
import { projectSchema } from '@/validations/projects'

const revalidUrls = ['/admin/projects', '/project']

export async function createProjectAction(data: ProjectInput) {
  try {
    await requireServerAdminSession()

    const parsed = projectSchema.parse(data)
    await createProject(parsed)

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    const parsed = projectSchema.parse(data)
    await updateProject(id, parsed)

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function reorderProjectsAction(ids: string[]) {
  try {
    await requireServerAdminSession()

    idsSchema.parse(ids)
    const result = await reorderProjects(ids)

    revalidatePaths(...revalidUrls)
    return success<Project[]>(result)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    await deleteProject(id)

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function batchDeleteProjectsAction(ids: string[]) {
  try {
    await requireServerAdminSession()

    idsSchema.parse(ids)
    const count = await deleteProjects(ids)

    revalidatePaths(...revalidUrls)
    return success<number>(count)
  } catch (error: unknown) {
    return failure(error)
  }
}
