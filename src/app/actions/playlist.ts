'use server'

import type { CreateSongInput, UpdateSongInput } from '@/types'

import { revalidatePath } from 'next/cache'

import { playlistDb } from '@/db/playlist'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'

export async function getPlaylistAction() {
  try {
    const result = await playlistDb.queryAll()
    return actionSuccess(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createSongAction(data: CreateSongInput) {
  try {
    await checkAdmin()
    await playlistDb.create({ ...data })

    revalidatePath('/admin/playlist')
    revalidatePath('/')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function updateSongAction(id: string, data: UpdateSongInput) {
  try {
    await checkAdmin()
    await playlistDb.update(id, data)
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
