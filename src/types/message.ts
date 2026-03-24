import type { Message as PrismaMessage } from '~/prisma/generated/client'

export type Message = Omit<PrismaMessage, 'createdAt'> & {
  createdAt: string
}

export type { PrismaMessage }

export interface CreateMessageInput {
  message: string
  userId: string
  userName: string
  userImg: string
  parentId?: string
}
