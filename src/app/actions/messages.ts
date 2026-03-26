'use server'

import { revalidatePath } from 'next/cache'

import { messageDb } from '@/db/messages'
import { actionError, actionSuccess } from '@/lib/action'
import { checkAdmin, getSession } from '@/lib/auth'

export async function getMessagesAction() {
  try {
    const result = await messageDb.queryAll()
    return actionSuccess(result)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function sendMessageAction(message: string) {
  try {
    const session = await getSession()
    if (!session) throw new Error('Not authenticated')
    if (session.user.banned) throw new Error('You are banned')

    await messageDb.create({
      message,
      userId: session.user.id,
      userName: session.user.name,
      userImg: session.user.image ?? ''
    })

    revalidatePath('/message')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await checkAdmin()
    await messageDb.delete(id)
    revalidatePath('/admin/messages')
    revalidatePath('/message')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function createMessageAction(message: string, userId?: string) {
  try {
    const session = await checkAdmin()
    const name = userId ? `User (${userId})` : session.user.name
    const img = userId ? '' : (session.user.image ?? '')

    await messageDb.create({
      message,
      userId: userId ?? session.user.id,
      userName: name,
      userImg: img
    })
    revalidatePath('/admin/messages')
    revalidatePath('/message')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function replyToMessageAction(parentId: string, message: string) {
  try {
    const session = await checkAdmin()
    await messageDb.create({
      message,
      userId: session.user.id,
      userName: session.user.name,
      userImg: session.user.image ?? '',
      parentId
    })
    revalidatePath('/admin/messages')
    revalidatePath('/message')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}
