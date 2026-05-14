import type { Message, Playlist, Project } from '@/types'

import { cache } from 'react'

import { requireServerAdminSession } from '@/lib/auth-session'
import { prisma } from '@/lib/prisma'

import 'server-only'

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
  recentUsers: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    createdAt: string
    updatedAt: string
    banExpires: string | null
  }[]
  projects: Project[]
  recentSongs: Playlist[]
}

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  await requireServerAdminSession()

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
      select: {
        id: true,
        message: true,
        createdAt: true,
        userId: true,
        userName: true,
        userImg: true,
        parentId: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        link: true,
        icon: true,
        order: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { order: 'asc' }
    }),
    prisma.playlist.findMany({
      select: {
        id: true,
        name: true,
        author: true,
        cover: true,
        url: true,
        duration: true,
        order: true,
        createdAt: true,
        updatedAt: true
      },
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
    recentMessages: recentMessages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt.toISOString()
    })),
    recentUsers: recentUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      banExpires: user.banExpires?.toISOString() ?? null
    })),
    projects: projects.map((project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    })),
    recentSongs: recentSongs.map((song) => ({
      ...song,
      createdAt: song.createdAt.toISOString(),
      updatedAt: song.updatedAt.toISOString()
    }))
  }
})
