'use server'

import type { Playlist } from '@/types'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'

import { playlistDb } from '@/db/playlist'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin } from '@/lib/auth'

export const songSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  author: z.array(z.string().min(1)).min(1, 'Artist is required'),
  cover: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  url: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  duration: z
    .string()
    .regex(/^(\d{1,2}:)?\d{2}:\d{2}$|^$/, 'Format: MM:SS or HH:MM:SS')
})

export type SongInput = z.infer<typeof songSchema>

export async function getPlaylistAction() {
  try {
    const result = await playlistDb.queryAll()
    return actionSuccess<Playlist[]>(result)
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
    return actionSuccess(null)
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
    return actionSuccess(null)
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
    return actionSuccess(null)
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
    return actionSuccess<number>(count)
  } catch (error: unknown) {
    return actionError(error)
  }
}
