import type { SongInput } from '@/lib/schemas'
import type { Playlist, PrismaPlaylist } from '@/types'

import { prisma } from '@/lib/prisma'

class PlaylistDb {
  async queryAll(): Promise<Playlist[]> {
    const list = await prisma.playlist.findMany({ orderBy: { order: 'asc' } })
    return list.map(this.serialize)
  }

  async create(data: SongInput): Promise<Playlist> {
    const maxOrder = await prisma.playlist.aggregate({ _max: { order: true } })
    const result = await prisma.playlist.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 }
    })
    return this.serialize(result)
  }

  async update(id: string, songData: SongInput): Promise<Playlist> {
    const result = await prisma.playlist.update({
      where: { id },
      data: songData
    })
    return this.serialize(result)
  }

  async delete(id: string): Promise<Playlist> {
    const result = await prisma.playlist.delete({ where: { id } })
    return this.serialize(result)
  }

  async deleteMany(ids: string[]): Promise<number> {
    const { count } = await prisma.playlist.deleteMany({
      where: { id: { in: ids } }
    })
    return count
  }

  private serialize(row: PrismaPlaylist): Playlist {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }
  }
}

export const playlistDb = new PlaylistDb()
