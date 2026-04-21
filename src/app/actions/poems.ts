'use server'

import type { PoemInput } from '@/lib/schemas'

import { revalidatePath } from 'next/cache'

import { poemDb } from '@/db/poems'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'
import { poemSchema } from '@/lib/schemas'

export async function getPoemsAction() {
  try {
    const result = await poemDb.queryAll()
    return actionSuccess(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createPoemAction(data: PoemInput) {
  try {
    await checkAdmin()
    const parsed = poemSchema.parse(data)
    await poemDb.create(parsed)
    revalidatePath('/admin/poems')
    revalidatePath('/poems')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function updatePoemAction(id: string, data: PoemInput) {
  try {
    await checkAdmin()
    const parsed = poemSchema.parse(data)
    await poemDb.update(id, parsed)
    revalidatePath('/admin/poems')
    revalidatePath('/poems')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function deletePoemAction(id: string) {
  try {
    await checkAdmin()
    await poemDb.delete(id)
    revalidatePath('/admin/poems')
    revalidatePath('/poems')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function batchDeletePoemsAction(ids: string[]) {
  try {
    await checkAdmin()
    const count = await poemDb.deleteMany(ids)
    revalidatePath('/admin/poems')
    revalidatePath('/poems')
    return actionSuccess(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}
