import type {
  CreateMessageInput,
  Message,
  MessageWithReplies,
  PrismaMessage
} from '@/types'

import { prisma } from '@/lib/prisma'

class MessageDb {
  async queryAll(): Promise<MessageWithReplies[]> {
    const list = await prisma.message.findMany({
      where: { parentId: null },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return list.map((msg) => ({
      ...this.serialize(msg),
      replies: msg.replies.map(this.serialize)
    }))
  }

  async create(data: CreateMessageInput): Promise<Message> {
    const result = await prisma.message.create({ data })
    return this.serialize(result)
  }

  async update(id: string, message: string): Promise<Message> {
    const result = await prisma.message.update({
      where: { id },
      data: { message }
    })
    return this.serialize(result)
  }

  async delete(id: string): Promise<void> {
    await prisma.message.delete({ where: { id } })
  }

  async deleteMany(ids: string[]): Promise<number> {
    const { count } = await prisma.message.deleteMany({
      where: { id: { in: ids } }
    })
    return count
  }

  private serialize(row: PrismaMessage): Message {
    return {
      ...row,
      createdAt: row.createdAt.toISOString()
    }
  }
}

export const messageDb = new MessageDb()
