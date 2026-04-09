import type { Poem as PrismaPoem } from '~/prisma/generated/client'

export type Poem = Omit<PrismaPoem, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type { PrismaPoem }
