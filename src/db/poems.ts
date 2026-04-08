import type {
  CreatePoemInput,
  Poem,
  PrismaPoem,
  UpdatePoemInput
} from '@/types'

import { prisma } from '@/lib/prisma'

class PoemDb {
  async queryAll(): Promise<Poem[]> {
    const list = await prisma.poem.findMany({ orderBy: { createdAt: 'desc' } })
    return list.map(this.serialize)
  }

  async create(data: CreatePoemInput): Promise<Poem> {
    const result = await prisma.poem.create({ data })
    return this.serialize(result)
  }

  async update(id: string, data: UpdatePoemInput): Promise<Poem> {
    const result = await prisma.poem.update({ where: { id }, data })
    return this.serialize(result)
  }

  async delete(id: string): Promise<Poem> {
    const result = await prisma.poem.delete({ where: { id } })
    return this.serialize(result)
  }

  private serialize(row: PrismaPoem): Poem {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }
  }
}

export const poemDb = new PoemDb()
