import type { DashboardData } from '@/db/dashboard'

import {
  ArrowRight,
  FolderKanban,
  MessageSquare,
  Music,
  Users
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/* --- Stat Card --- */

interface StatCardProps {
  title: string
  value: number
  newThisMonth?: number
  icon: React.ReactNode
}

function StatCard({ title, value, newThisMonth, icon }: StatCardProps) {
  return (
    <div className="border-border rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {newThisMonth !== undefined && (
        <p className="text-muted-foreground mt-1 text-xs">
          +{newThisMonth} this month
        </p>
      )}
    </div>
  )
}

/* --- Section Card --- */

interface SectionCardProps {
  title: string
  href: string
  linkText: string
  children: React.ReactNode
}

function SectionCard({ title, href, linkText, children }: SectionCardProps) {
  return (
    <div className="border-border rounded-lg border">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link
          href={href}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
        >
          {linkText}
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* --- Dashboard --- */

interface DashboardProps {
  data: DashboardData
}

function Dashboard({ data }: DashboardProps) {
  const { stats, recentMessages, recentUsers, projects, recentSongs } = data

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Users"
          value={stats.totalUsers}
          newThisMonth={stats.newUsersThisMonth}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Messages"
          value={stats.totalMessages}
          newThisMonth={stats.newMessagesThisMonth}
          icon={<MessageSquare size={20} />}
        />
        <StatCard
          title="Projects"
          value={stats.totalProjects}
          icon={<FolderKanban size={20} />}
        />
        <StatCard
          title="Songs"
          value={stats.totalSongs}
          icon={<Music size={20} />}
        />
      </div>

      {/* Recent Messages & Users */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Recent Messages"
          href="/admin/messages"
          linkText="View all"
        >
          <div className="space-y-4">
            {recentMessages.length === 0 && (
              <p className="text-muted-foreground text-sm">No messages yet.</p>
            )}
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  {(msg.userName ?? 'U').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {msg.userName ?? 'Unknown'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-sm">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Users"
          href="/admin/users"
          linkText="View all"
        >
          <div className="space-y-4">
            {recentUsers.length === 0 && (
              <p className="text-muted-foreground text-sm">No users yet.</p>
            )}
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs font-medium">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </p>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Projects & Playlist */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Projects" href="/admin/projects" linkText="Manage">
          <div className="space-y-3">
            {projects.length === 0 && (
              <p className="text-muted-foreground text-sm">No projects yet.</p>
            )}
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-3">
                {project.icon ? (
                  <Image
                    src={project.icon}
                    alt={project.name}
                    width={28}
                    height={28}
                    className="size-7 rounded"
                  />
                ) : (
                  <div className="bg-muted flex size-7 items-center justify-center rounded">
                    <FolderKanban size={14} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  {project.description && (
                    <p className="text-muted-foreground truncate text-xs">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Playlist" href="/admin/playlist" linkText="Manage">
          <div className="space-y-3">
            {recentSongs.length === 0 && (
              <p className="text-muted-foreground text-sm">No songs yet.</p>
            )}
            {recentSongs.map((song) => (
              <div key={song.id} className="flex items-center gap-3">
                {song.cover ? (
                  <Image
                    src={song.cover}
                    alt={song.name}
                    width={28}
                    height={28}
                    className="size-7 rounded"
                  />
                ) : (
                  <div className="bg-muted flex size-7 items-center justify-center rounded">
                    <Music size={14} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{song.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {song.author.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

export default Dashboard
