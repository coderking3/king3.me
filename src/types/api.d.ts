import type {
  Message as PrismaMessage,
  Photo as PrismaPhoto,
  Playlist as PrismaPlaylist,
  Poem as PrismaPoem,
  Project as PrismaProject,
  User as PrismaUser
} from '~/prisma/generated/client'

/* Message  */

type Message = Omit<PrismaMessage, 'createdAt'> & {
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

/* Photo  */

type Photo = Omit<PrismaPhoto, 'date' | 'createdAt' | 'updatedAt'> & {
  date: string
  createdAt: string
  updatedAt: string
}

/* Playlist  */

type Playlist = Omit<PrismaPlaylist, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

/* Poem  */

type Poem = Omit<PrismaPoem, 'date' | 'createdAt' | 'updatedAt'> & {
  date: string
  createdAt: string
  updatedAt: string
}

/* Project  */

type Project = Omit<PrismaProject, 'createdAt' | 'updatedAt'> & {
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

type User = Omit<PrismaUser, 'createdAt' | 'updatedAt' | 'banExpires'> & {
  role: UserRole
  createdAt: string
  updatedAt: string
  banExpires: string
}

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

export type {
  // Part: Message
  CreateMessageInput,
  Message,
  MessageWithReplies,
  PrismaMessage,
  // Part: Photo
  Photo,
  PrismaPhoto,
  // Part: Playlist
  Playlist,
  PrismaPlaylist,
  // Part: Poem
  Poem,
  PrismaPoem,
  // Part: Project
  PrismaProject,
  Project,
  // Part: Search
  SearchData,
  // Part: Dashboard
  DashboardData,
  // Part: User
  PrismaUser,
  User,
  UserRole
}
