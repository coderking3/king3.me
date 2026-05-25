'use server'

import type { Project } from '@/types'
import type { ProjectInput } from '@/validations/projects'

import {
  createProject,
  deleteProject,
  deleteProjects,
  reorderProjects,
  revalidateProjects,
  updateProject
} from '@/data/projects'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { idSchema, idsSchema } from '@/validations/common'
import { projectSchema } from '@/validations/projects'

export async function createProjectAction(data: ProjectInput) {
  try {
    await requireServerAdminSession()

    const parsed = projectSchema.parse(data)
    await createProject(parsed)

    revalidateProjects()
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

    revalidateProjects()
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

    revalidateProjects()
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

    revalidateProjects()
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

    revalidateProjects()
    return success<number>(count)
  } catch (error: unknown) {
    return failure(error)
  }
}
