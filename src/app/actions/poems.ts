'use server'

import type { CreatePoemInput, UpdatePoemInput } from '@/types'

import { revalidatePath } from 'next/cache'

import { poemDb } from '@/db/poems'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'

export async function getPoemsAction() {
  try {
    const result = await poemDb.queryAll()
    return actionSuccess(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createPoemAction(input: CreatePoemInput) {
  try {
    await checkAdmin()
    await poemDb.create(input)
    revalidatePath('/admin/poems')
    revalidatePath('/poems')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function updatePoemAction(id: string, input: UpdatePoemInput) {
  try {
    await checkAdmin()
    await poemDb.update(id, input)
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
