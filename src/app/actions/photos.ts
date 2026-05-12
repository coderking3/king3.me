'use server'

import type { Photo } from '@/types'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'

import { photoDb } from '@/db/photos'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'

export const photoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  url: z.url('Please enter a valid URL'),
  width: z.coerce.number().int().positive('Width must be positive'),
  height: z.coerce.number().int().positive('Height must be positive'),
  date: z.coerce.date()
})

export type PhotoInput = z.infer<typeof photoSchema>

export async function getPhotosAction() {
  try {
    const result = await photoDb.queryAll()
    return actionSuccess<Photo[]>(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createPhotoAction(data: PhotoInput) {
  try {
    await checkAdmin()
    const parsed = photoSchema.parse(data)
    await photoDb.create(parsed)
    revalidatePath('/admin/photos')
    revalidatePath('/photos')
    return actionSuccess(null)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function batchCreatePhotosAction(items: PhotoInput[]) {
  try {
    await checkAdmin()
    const parsed = items.map((item) => photoSchema.parse(item))
    const count = await photoDb.batchCreate(parsed)
    revalidatePath('/admin/photos')
    revalidatePath('/photos')
    return actionSuccess<number>(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function updatePhotoAction(id: string, data: PhotoInput) {
  try {
    await checkAdmin()
    const parsed = photoSchema.parse(data)
    await photoDb.update(id, parsed)
    revalidatePath('/admin/photos')
    revalidatePath('/photos')
    return actionSuccess(null)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function deletePhotoAction(id: string) {
  try {
    await checkAdmin()
    await photoDb.delete(id)
    revalidatePath('/admin/photos')
    revalidatePath('/photos')
    return actionSuccess(null)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function batchDeletePhotosAction(ids: string[]) {
  try {
    await checkAdmin()
    const count = await photoDb.deleteMany(ids)
    revalidatePath('/admin/photos')
    revalidatePath('/photos')
    return actionSuccess<number>(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}
