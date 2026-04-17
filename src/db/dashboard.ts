import type {
  Message,
  Playlist,
  PrismaMessage,
  PrismaPlaylist,
  PrismaProject,
  Project
} from '@/types'
import type { User as PrismaUser } from '~/prisma/generated/client'

import { prisma } from '@/lib/prisma'

type SerializedUser = Omit<
  PrismaUser,
  'createdAt' | 'updatedAt' | 'banExpires'
> & {
  createdAt: string
  updatedAt: string
  banExpires: string | null
}

export interface DashboardData {
  stats: {
    totalUsers: number
    totalMessages: number
    totalProjects: number
    totalSongs: number
    newUsersThisMonth: number
    newMessagesThisMonth: number
  }
  recentMessages: Message[]
  recentUsers: SerializedUser[]
  projects: Project[]
  recentSongs: Playlist[]
}

class DashboardDb {
  async query(): Promise<DashboardData> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalUsers,
      totalMessages,
      totalProjects,
      totalSongs,
      newUsersThisMonth,
      newMessagesThisMonth,
      recentMessages,
      recentUsers,
      projects,
      recentSongs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.message.count({ where: { parentId: null } }),
      prisma.project.count(),
      prisma.playlist.count(),
      prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.message.count({
        where: { parentId: null, createdAt: { gte: monthStart } }
      }),
      prisma.message.findMany({
        where: { parentId: null },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.project.findMany({
        orderBy: { order: 'asc' }
      }),
      prisma.playlist.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    return {
      stats: {
        totalUsers,
        totalMessages,
        totalProjects,
        totalSongs,
        newUsersThisMonth,
        newMessagesThisMonth
      },
      recentMessages: recentMessages.map(this.serializeMessage),
      recentUsers: recentUsers.map(this.serializeUser),
      projects: projects.map(this.serializeProject),
      recentSongs: recentSongs.map(this.serializePlaylist)
    }
  }

  private serializeMessage(row: PrismaMessage): Message {
    return {
      ...row,
      createdAt: row.createdAt.toISOString()
    }
  }

  private serializeUser(row: PrismaUser): SerializedUser {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      banExpires: row.banExpires?.toISOString() ?? null
    }
  }

  private serializeProject(row: PrismaProject): Project {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }
  }

  private serializePlaylist(row: PrismaPlaylist): Playlist {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }
  }
}

export const dashboardDb = new DashboardDb()
