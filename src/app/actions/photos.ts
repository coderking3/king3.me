'use server'

import type { PhotoInput } from '@/lib/schemas'

import { revalidatePath } from 'next/cache'

import { photoDb } from '@/db/photos'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'
import { photoSchema } from '@/lib/schemas'

export async function getPhotosAction() {
  try {
    const result = await photoDb.queryAll()
    return actionSuccess(result)
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
    return actionSuccess(undefined)
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
    return actionSuccess(count)
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
    return actionSuccess(undefined)
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
    return actionSuccess(undefined)
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
    return actionSuccess(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}
