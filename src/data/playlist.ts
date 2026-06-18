import type { Playlist } from '@/types'
import type { SongInput } from '@/validations/playlist'

import { asc, eq, inArray, max } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

import { db } from '@/lib/db'
import { playlist } from '@/lib/db/schema'

import 'server-only'

export async function getPlaylist(): Promise<Playlist[]> {
  'use cache'
  cacheLife('days')
  cacheTag('playlist')

  const songs = await db
    .select({
      id: playlist.id,
      name: playlist.name,
      author: playlist.author,
      cover: playlist.cover,
      url: playlist.url,
      duration: playlist.duration,
      order: playlist.order,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt
    })
    .from(playlist)
    .orderBy(asc(playlist.order))

  return songs.map((song) => ({
    ...song,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString()
  }))
}

export function invalidatePlaylist() {
  updateTag('playlist')
}

export async function createSong(data: SongInput) {
  const [{ maxOrder }] = await db
    .select({ maxOrder: max(playlist.order) })
    .from(playlist)

  const [created] = await db
    .insert(playlist)
    .values({ ...data, order: (maxOrder ?? -1) + 1 })
    .returning()

  return created
}

export async function updateSong(id: string, data: SongInput) {
  const [updated] = await db
    .update(playlist)
    .set(data)
    .where(eq(playlist.id, id))
    .returning()
  return updated
}

export async function deleteSong(id: string) {
  const [deleted] = await db
    .delete(playlist)
    .where(eq(playlist.id, id))
    .returning()
  return deleted
}

export async function deleteSongs(ids: string[]) {
  const deleted = await db
    .delete(playlist)
    .where(inArray(playlist.id, ids))
    .returning({ id: playlist.id })
  return deleted.length
}
