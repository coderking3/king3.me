import type { Photo as PrismaPhoto } from '~/prisma/generated/client'

export type Photo = Omit<PrismaPhoto, 'date' | 'createdAt' | 'updatedAt'> & {
  date: string
  createdAt: string
  updatedAt: string
}

export type { PrismaPhoto }
