import type { ProjectInput } from '@/lib/schemas'
import type { PrismaProject, Project } from '@/types'

import { prisma } from '@/lib/prisma'

class ProjectDb {
  async queryAll(): Promise<Project[]> {
    const list = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    })
    return list.map(this.serialize)
  }

  async create(data: ProjectInput): Promise<Project> {
    const maxOrder = await prisma.project.aggregate({ _max: { order: true } })
    const result = await prisma.project.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 }
    })
    return this.serialize(result)
  }

  async update(id: string, data: ProjectInput): Promise<Project> {
    const result = await prisma.project.update({ where: { id }, data })
    return this.serialize(result)
  }

  async reorder(ids: string[]): Promise<Project[]> {
    const currentProjects = await prisma.project.findMany({
      select: { id: true }
    })

    if (currentProjects.length !== ids.length) {
      throw new Error('Project reorder payload is incomplete.')
    }

    const currentIdSet = new Set(currentProjects.map((project) => project.id))
    if (
      ids.some((id) => !currentIdSet.has(id)) ||
      new Set(ids).size !== ids.length
    ) {
      throw new Error('Project reorder payload is invalid.')
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { order: index }
        })
      )
    )

    return this.queryAll()
  }

  async delete(id: string): Promise<Project> {
    const result = await prisma.project.delete({ where: { id } })
    return this.serialize(result)
  }

  async deleteMany(ids: string[]): Promise<number> {
    const { count } = await prisma.project.deleteMany({
      where: { id: { in: ids } }
    })
    // Re-compact order values after deletion
    const remaining = await prisma.project.findMany({
      select: { id: true },
      orderBy: { order: 'asc' }
    })
    if (remaining.length > 0) {
      await prisma.$transaction(
        remaining.map((p, index) =>
          prisma.project.update({
            where: { id: p.id },
            data: { order: index }
          })
        )
      )
    }
    return count
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
