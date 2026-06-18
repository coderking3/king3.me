import type { CreateMessageInput, MessageWithReplies } from '@/types'

import { eq, inArray } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

import { db } from '@/lib/db'
import { message } from '@/lib/db/schema'

import 'server-only'

export async function getMessages(): Promise<MessageWithReplies[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('messages')

  // Query nested replies via the Relational API
  const messages = await db.query.message.findMany({
    where: (m, { isNull }) => isNull(m.parentId),
    columns: {
      id: true,
      message: true,
      createdAt: true,
      userId: true,
      userName: true,
      userImg: true,
      parentId: true
    },
    with: {
      replies: {
        columns: {
          id: true,
          message: true,
          createdAt: true,
          userId: true,
          userName: true,
          userImg: true,
          parentId: true
        },
        orderBy: (reply, { asc }) => [asc(reply.createdAt)]
      }
    },
    orderBy: (m, { desc }) => [desc(m.createdAt)]
  })

  return messages.map((msg) => ({
    ...msg,
    createdAt: msg.createdAt.toISOString(),
    replies: msg.replies.map((reply) => ({
      ...reply,
      createdAt: reply.createdAt.toISOString()
    }))
  })) as MessageWithReplies[]
}

export function invalidateMessages() {
  updateTag('messages')
}

export async function createMessage(data: CreateMessageInput) {
  const [created] = await db.insert(message).values(data).returning()
  return created
}

// ⚠️ 参数名改为 text 避免与导入的 message 表名冲突
export async function updateMessage(id: string, text: string) {
  const [updated] = await db
    .update(message)
    .set({ message: text })
    .where(eq(message.id, id))
    .returning()
  return updated
}

export async function deleteMessage(id: string) {
  const [deleted] = await db
    .delete(message)
    .where(eq(message.id, id))
    .returning()
  return deleted
}

export async function deleteMessages(ids: string[]) {
  const deleted = await db
    .delete(message)
    .where(inArray(message.id, ids))
    .returning({ id: message.id })
  return deleted.length
}
