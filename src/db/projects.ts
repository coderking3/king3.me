import type {
  CreateProjectInput,
  PrismaProject,
  Project,
  UpdateProjectInput
} from '@/types'

import { prisma } from '@/lib/prisma'

class ProjectDb {
  async queryAll(): Promise<Project[]> {
    const list = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    })
    return list.map(this.serialize)
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const maxOrder = await prisma.project.aggregate({ _max: { order: true } })
    const result = await prisma.project.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 }
    })
    return this.serialize(result)
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    const result = await prisma.project.update({ where: { id }, data })
    return this.serialize(result)
  }

  async delete(id: string): Promise<Project> {
    const result = await prisma.project.delete({ where: { id } })
    return this.serialize(result)
  }

  private serialize(row: PrismaProject): Project {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }
  }
}

export const projectDb = new ProjectDb()
