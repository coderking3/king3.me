'use server'

import type { PoemInput } from '@/validations/poems'

import { createPoem, deletePoem, deletePoems, updatePoem } from '@/data/poems'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { revalidatePaths } from '@/lib/revalidate'
import { idSchema, idsSchema } from '@/validations/common'
import { poemSchema } from '@/validations/poems'

const revalidUrls = ['/admin/poems', '/poems']

export async function createPoemAction(data: PoemInput) {
  try {
    await requireServerAdminSession()

    const parsed = poemSchema.parse(data)
    await createPoem(parsed)

    revalidatePaths(...revalidUrls)
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

    revalidatePaths(...revalidUrls)
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

    revalidatePaths(...revalidUrls)
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

    revalidatePaths(...revalidUrls)
    return success(count)
  } catch (error: unknown) {
    return failure(error)
  }
}
