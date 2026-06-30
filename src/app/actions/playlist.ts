'use server'

import type { SongInput } from '@/validations/playlist'

import {
  createSong,
  deleteSong,
  deleteSongs,
  invalidateSongs,
  updateSong
} from '@/data/playlist'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { idSchema, idsSchema } from '@/validations/common'
import { songSchema } from '@/validations/playlist'

export async function createSongAction(data: SongInput) {
  try {
    await requireServerAdminSession()

    const parsed = songSchema.parse(data)
    await createSong(parsed)

    invalidateSongs()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function updateSongAction(id: string, data: SongInput) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    const parsed = songSchema.parse(data)
    await updateSong(id, parsed)

    invalidateSongs()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function deleteSongAction(id: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    await deleteSong(id)

    invalidateSongs()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function batchDeleteSongsAction(ids: string[]) {
  try {
    await requireServerAdminSession()

    idsSchema.parse(ids)
    const count = await deleteSongs(ids)

    invalidateSongs()
    return success<number>(count)
  } catch (error: unknown) {
    return failure(error)
  }
}
