import type { PhotoInput } from '@/lib/schemas'
import type { Photo, PrismaPhoto } from '@/types'

import { prisma } from '@/lib/prisma'

class PhotoDb {
  async queryAll(): Promise<Photo[]> {
    const list = await prisma.photo.findMany({
      orderBy: { date: 'desc' }
    })
    return list.map(this.serialize)
  }

  async create(data: PhotoInput): Promise<Photo> {
    const result = await prisma.photo.create({ data })
    return this.serialize(result)
  }

  async batchCreate(data: PhotoInput[]): Promise<number> {
    const result = await prisma.photo.createMany({ data })
    return result.count
  }

  async update(id: string, data: PhotoInput): Promise<Photo> {
    const result = await prisma.photo.update({ where: { id }, data })
    return this.serialize(result)
  }

  async delete(id: string): Promise<Photo> {
    const result = await prisma.photo.delete({ where: { id } })
    return this.serialize(result)
  }

  async deleteMany(ids: string[]): Promise<number> {
    const { count } = await prisma.photo.deleteMany({
      where: { id: { in: ids } }
    })
    return count
  }

  private serialize(row: PrismaPhoto): Photo {
    return {
      ...row,
      date: row.date.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }
  }
}

export const photoDb = new PhotoDb()
