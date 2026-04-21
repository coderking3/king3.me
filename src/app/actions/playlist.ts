'use server'

import type { SongInput } from '@/lib/schemas'

import { revalidatePath } from 'next/cache'

import { playlistDb } from '@/db/playlist'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'
import { songSchema } from '@/lib/schemas'

export async function getPlaylistAction() {
  try {
    const result = await playlistDb.queryAll()
    return actionSuccess(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createSongAction(data: SongInput) {
  try {
    await checkAdmin()
    const parsed = songSchema.parse(data)
    await playlistDb.create({ ...parsed })

    revalidatePath('/admin/playlist')
    revalidatePath('/')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function updateSongAction(id: string, data: SongInput) {
  try {
    await checkAdmin()
    const parsed = songSchema.parse(data)
    await playlistDb.update(id, parsed)
    revalidatePath('/admin/playlist')
    revalidatePath('/')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function deleteSongAction(id: string) {
  try {
    await checkAdmin()
    await playlistDb.delete(id)
    revalidatePath('/admin/playlist')
    revalidatePath('/')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function batchDeleteSongsAction(ids: string[]) {
  try {
    await checkAdmin()
    const count = await playlistDb.deleteMany(ids)
    revalidatePath('/admin/playlist')
    revalidatePath('/')
    return actionSuccess(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}
