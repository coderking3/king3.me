import type { Poem as PrismaPoem } from '~/prisma/generated/client'

export type Poem = Omit<PrismaPoem, 'date' | 'createdAt' | 'updatedAt'> & {
  date: string
  createdAt: string
  updatedAt: string
}

export type { PrismaPoem }
