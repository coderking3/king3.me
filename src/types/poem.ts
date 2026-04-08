import type { Poem as PrismaPoem } from '~/prisma/generated/client'

export type Poem = Omit<PrismaPoem, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type { PrismaPoem }

export interface CreatePoemInput {
  title: string
  author: string
  content: string
}

export type UpdatePoemInput = CreatePoemInput
