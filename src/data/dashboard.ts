import type { DashboardData } from '@/types'

import { and, asc, count, desc, gte, isNull } from 'drizzle-orm'

import { requireServerAdminSession } from '@/lib/auth-session'
import { db } from '@/lib/db'
import { message, playlist, project, user } from '@/lib/db/schema'

import 'server-only'

export const getDashboardData = async (): Promise<DashboardData> => {
  await requireServerAdminSession()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsersRes,
    totalMessagesRes,
    totalProjectsRes,
    totalSongsRes,
    newUsersRes,
    newMessagesRes,
    recentMessages,
    recentUsers,
    projects,
    recentSongs
  ] = await Promise.all([
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(message).where(isNull(message.parentId)),
    db.select({ value: count() }).from(project),
    db.select({ value: count() }).from(playlist),
    db
      .select({ value: count() })
      .from(user)
      .where(gte(user.createdAt, monthStart)),
    db
      .select({ value: count() })
      .from(message)
      .where(and(isNull(message.parentId), gte(message.createdAt, monthStart))),
    db
      .select({
        id: message.id,
        message: message.message,
        createdAt: message.createdAt,
        userId: message.userId,
        userName: message.userName,
        userImg: message.userImg,
        parentId: message.parentId
      })
      .from(message)
      .where(isNull(message.parentId))
      .orderBy(desc(message.createdAt))
      .limit(5),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        banExpires: user.banExpires,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(5),
    db
      .select({
        id: project.id,
        name: project.name,
        description: project.description,
        link: project.link,
        icon: project.icon,
        order: project.order,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      })
      .from(project)
      .orderBy(asc(project.order)),
    db
      .select({
        id: playlist.id,
        name: playlist.name,
        author: playlist.author,
        cover: playlist.cover,
        url: playlist.url,
        duration: playlist.duration,
        order: playlist.order,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt
      })
      .from(playlist)
      .orderBy(desc(playlist.createdAt))
      .limit(5)
  ])

  return {
    stats: {
      totalUsers: totalUsersRes[0].value,
      totalMessages: totalMessagesRes[0].value,
      totalProjects: totalProjectsRes[0].value,
      totalSongs: totalSongsRes[0].value,
      newUsersThisMonth: newUsersRes[0].value,
      newMessagesThisMonth: newMessagesRes[0].value
    },
    recentMessages: recentMessages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt.toISOString()
    })),
    recentUsers: recentUsers.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      banExpires: u.banExpires?.toISOString() ?? null
    })),
    projects: projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    })),
    recentSongs: recentSongs.map((song) => ({
      ...song,
      createdAt: song.createdAt.toISOString(),
      updatedAt: song.updatedAt.toISOString()
    }))
  }
}
