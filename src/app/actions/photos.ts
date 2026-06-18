'use server'

import type { PhotoInput } from '@/validations/photos'

import {
  createPhoto,
  createPhotos,
  deletePhoto,
  deletePhotos,
  invalidatePhotos,
  updatePhoto
} from '@/data/photos'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { idSchema, idsSchema } from '@/validations/common'
import { photoSchema } from '@/validations/photos'

export async function createPhotoAction(photo: PhotoInput) {
  try {
    await requireServerAdminSession()

    const parsed = photoSchema.parse(photo)
    await createPhoto(parsed)

    invalidatePhotos()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function batchCreatePhotosAction(photos: PhotoInput[]) {
  try {
    await requireServerAdminSession()

    const parsed = photos.map((photo) => photoSchema.parse(photo))
    const count = await createPhotos(parsed)

    invalidatePhotos()
    return success<number>(count)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function updatePhotoAction(id: string, photo: PhotoInput) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    const parsed = photoSchema.parse(photo)
    await updatePhoto(id, parsed)

    invalidatePhotos()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function deletePhotoAction(id: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    await deletePhoto(id)

    invalidatePhotos()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function batchDeletePhotosAction(ids: string[]) {
  try {
    await requireServerAdminSession()

    idsSchema.parse(ids)
    const count = await deletePhotos(ids)

    invalidatePhotos()
    return success<number>(count)
  } catch (error: unknown) {
    return failure(error)
  }
}
