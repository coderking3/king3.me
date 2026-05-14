import type { Poem } from '@/types'
import type { PoemInput } from '@/validations/poems'

import { cache } from 'react'

import { prisma } from '@/lib/prisma'

import 'server-only'

export const getPoems = cache(async (): Promise<Poem[]> => {
  const poems = await prisma.poem.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      content: true,
      date: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return poems.map((poem) => ({
    ...poem,
    date: poem.date.toISOString(),
    createdAt: poem.createdAt.toISOString(),
    updatedAt: poem.updatedAt.toISOString()
  }))
})

export async function createPoem(data: PoemInput) {
  return prisma.poem.create({ data })
}

export async function updatePoem(id: string, data: PoemInput) {
  return prisma.poem.update({ where: { id }, data })
}

export async function deletePoem(id: string) {
  return prisma.poem.delete({ where: { id } })
}

export async function deletePoems(ids: string[]) {
  const { count } = await prisma.poem.deleteMany({
    where: { id: { in: ids } }
  })

  return count
}
