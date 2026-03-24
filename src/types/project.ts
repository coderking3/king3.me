import type { Project as PrismaProject } from '~/prisma/generated/client'

export type Project = Omit<PrismaProject, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
export type { PrismaProject }

export interface CreateProjectInput {
  name: string
  description: string
  link: string
  icon: string
}

export type UpdateProjectInput = CreateProjectInput
