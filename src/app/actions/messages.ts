'use server'

import type { AuthenticatedServerSession } from '@/lib/auth-session'

import {
  createMessage,
  deleteMessage,
  deleteMessages,
  updateMessage
} from '@/data/messages'
import { getServerSession, requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { revalidatePaths } from '@/lib/revalidate'
import { idSchema, idsSchema } from '@/validations/common'
import { messageSchema } from '@/validations/messages'

const revalidUrls = ['/admin/messages', '/message']

interface InsertMessageParam {
  message: string
  parentId?: string
}

function buildMessageData(
  param: InsertMessageParam,
  session: AuthenticatedServerSession
) {
  return {
    message: param.message,
    userId: session.user.id,
    userName: session.user.name,
    userImg: session.user.image ?? '',

    ...(param.parentId ? { parentId: param.parentId } : {})
  }
}

export async function sendMessageAction(message: string) {
  try {
    const session = await getServerSession()
    if (!session) throw new Error('Not authenticated')
    if (session.user.banned) throw new Error('You are banned')

    messageSchema.parse({ message })
    await createMessage(buildMessageData({ message }, session))

    revalidatePaths('/message')
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    await deleteMessage(id)

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function batchDeleteMessagesAction(ids: string[]) {
  try {
    await requireServerAdminSession()

    idsSchema.parse(ids)
    const count = await deleteMessages(ids)

    revalidatePaths(...revalidUrls)
    return success<number>(count)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function createMessageAction(
  message: string,
  options: { parentId?: string } = {}
) {
  try {
    const session = await requireServerAdminSession()

    const { parentId } = options
    messageSchema.parse({ message })
    await createMessage(buildMessageData({ message, parentId }, session))

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function updateMessageAction(id: string, message: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(id)
    messageSchema.parse({ message })
    await updateMessage(id, message)

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function replyToMessageAction(parentId: string, message: string) {
  try {
    const session = await requireServerAdminSession()

    idSchema.parse(parentId)
    messageSchema.parse({ message })
    await createMessage(buildMessageData({ message, parentId }, session))

    revalidatePaths(...revalidUrls)
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}
