import type {
  message,
  photo,
  playlist,
  poem,
  project,
  user
} from '@/lib/db/schema'

/* Dashboard */

interface DashboardStats {
  totalUsers: number
  totalMessages: number
  totalProjects: number
  totalSongs: number
  newUsersThisMonth: number
  newMessagesThisMonth: number
}

interface DashboardData {
  stats: DashboardStats
  recentMessages: Message[]
  recentUsers: User[]
  projects: Project[]
  recentSongs: Playlist[]
}

/* Message */

type Message = Omit<typeof message.$inferSelect, 'createdAt'> & {
  createdAt: string
}

type MessageWithReplies = Message & { replies: Message[] }

interface CreateMessageInput {
  message: string
  userId: string
  userName: string
  userImg: string
  parentId?: string
}

/* Photo */

type Photo = Omit<
  typeof photo.$inferSelect,
  'date' | 'createdAt' | 'updatedAt'
> & {
  date: string
  createdAt: string
  updatedAt: string
}

/* Playlist */

type Playlist = Omit<
  typeof playlist.$inferSelect,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

/* Poem */

type Poem = Omit<
  typeof poem.$inferSelect,
  'date' | 'createdAt' | 'updatedAt'
> & {
  date: string
  createdAt: string
  updatedAt: string
}

/* Project */

type Project = Omit<typeof project.$inferSelect, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

/* Search */

interface SearchData {
  posts: PostsMetadata[]
  projects: Project[]
}

/* User */

type UserRole = 'admin' | 'user'

type User = Omit<
  typeof user.$inferSelect,
  'createdAt' | 'updatedAt' | 'banExpires'
> & {
  createdAt: string
  updatedAt: string
  banExpires: string | null
}

export type {
  // Part: Dashboard
  DashboardData,
  // Part: Message
  CreateMessageInput,
  Message,
  MessageWithReplies,
  // Part: Photo
  Photo,
  // Part: Playlist
  Playlist,
  // Part: Poem
  Poem,
  // Part: Project
  Project,
  // Part: Search
  SearchData,
  // Part: User
  User,
  UserRole
}
