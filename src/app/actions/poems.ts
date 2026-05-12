'use server'

import type { Poem } from '@/types'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'

import { poemDb } from '@/db/poems'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'

export const poemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author is too long'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content is too long'),
  date: z.coerce.date()
})

export type PoemInput = z.infer<typeof poemSchema>

export async function getPoemsAction() {
  try {
    const result = await poemDb.queryAll()
    return actionSuccess<Poem[]>(result)
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
    return actionSuccess(null)
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
    return actionSuccess(null)
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
    return actionSuccess(null)
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
