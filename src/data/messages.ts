import type { CreateMessageInput, MessageWithReplies } from '@/types'

import { cache } from 'react'

import { prisma } from '@/lib/prisma'

import 'server-only'

export const getMessages = cache(async (): Promise<MessageWithReplies[]> => {
  const messages = await prisma.message.findMany({
    where: { parentId: null },
    select: {
      id: true,
      message: true,
      createdAt: true,
      userId: true,
      userName: true,
      userImg: true,
      parentId: true,
      replies: {
        select: {
          id: true,
          message: true,
          createdAt: true,
          userId: true,
          userName: true,
          userImg: true,
          parentId: true
        },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return messages.map((msg) => ({
    ...msg,
    createdAt: msg.createdAt.toISOString(),
    replies: msg.replies.map((reply) => ({
      ...reply,
      createdAt: reply.createdAt.toISOString()
    }))
  })) as MessageWithReplies[]
})

export async function createMessage(data: CreateMessageInput) {
  return prisma.message.create({ data })
}

export async function updateMessage(id: string, message: string) {
  return prisma.message.update({
    where: { id },
    data: { message }
  })
}

export async function deleteMessage(id: string) {
  return prisma.message.delete({ where: { id } })
}

export async function deleteMessages(ids: string[]) {
  const { count } = await prisma.message.deleteMany({
    where: { id: { in: ids } }
  })

  return count
}
