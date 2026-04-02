import { prisma } from '@/lib/prisma'

export async function getDashboardData() {
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
    recentMessages,
    recentUsers,
    projects,
    recentSongs
  }
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>
