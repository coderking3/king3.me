'use server'

import type { PoemInput } from '@/validations/poems'

import {
  createPoem,
  deletePoem,
  deletePoems,
  invalidatePoems,
  updatePoem
} from '@/data/poems'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { idSchema, idsSchema } from '@/validations/common'
import { poemSchema } from '@/validations/poems'

export async function createPoemAction(data: PoemInput) {
  try {
    await requireServerAdminSession()

    const parsed = poemSchema.parse(data)
    await createPoem(parsed)

    invalidatePoems()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function updatePoemAction(id: string, data: PoemInput) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    const parsed = poemSchema.parse(data)
    await updatePoem(id, parsed)

    invalidatePoems()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function deletePoemAction(id: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    await deletePoem(id)

    invalidatePoems()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function batchDeletePoemsAction(ids: string[]) {
  try {
    await requireServerAdminSession()

    idsSchema.parse(ids)
    const count = await deletePoems(ids)

    invalidatePoems()
    return success(count)
  } catch (error: unknown) {
    return failure(error)
  }
}
