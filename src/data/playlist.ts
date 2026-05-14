import type { Playlist } from '@/types'
import type { SongInput } from '@/validations/playlist'

import { cache } from 'react'

import { prisma } from '@/lib/prisma'

import 'server-only'

export const getPlaylist = cache(async (): Promise<Playlist[]> => {
  const songs = await prisma.playlist.findMany({
    select: {
      id: true,
      name: true,
      author: true,
      cover: true,
      url: true,
      duration: true,
      order: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { order: 'asc' }
  })

  return songs.map((song) => ({
    ...song,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString()
  }))
})

export async function createSong(data: SongInput) {
  const maxOrder = await prisma.playlist.aggregate({ _max: { order: true } })

  return prisma.playlist.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 }
  })
}

export async function updateSong(id: string, data: SongInput) {
  return prisma.playlist.update({ where: { id }, data })
}

export async function deleteSong(id: string) {
  return prisma.playlist.delete({ where: { id } })
}

export async function deleteSongs(ids: string[]) {
  const { count } = await prisma.playlist.deleteMany({
    where: { id: { in: ids } }
  })

  return count
}
