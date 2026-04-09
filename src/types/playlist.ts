import type { Playlist as PrismaPlaylist } from '~/prisma/generated/client'

export type Playlist = Omit<PrismaPlaylist, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type { PrismaPlaylist }
