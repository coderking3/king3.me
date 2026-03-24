'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { actionError, actionSuccess } from '@/lib/action'
import { auth, checkAdmin } from '@/lib/auth'

export async function getUsersAction() {
  try {
    await checkAdmin()
    const result = await auth.api.listUsers({
      headers: await headers(),
      query: { limit: 100 }
    })
    return actionSuccess(result.users)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function banUserAction(userId: string, reason?: string) {
  try {
    await checkAdmin()
    await auth.api.banUser({
      headers: await headers(),
      body: { userId, banReason: reason }
    })
    revalidatePath('/admin/users')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

export async function unbanUserAction(userId: string) {
  try {
    await checkAdmin()
    await auth.api.unbanUser({
      headers: await headers(),
      body: { userId }
    })
    revalidatePath('/admin/users')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}

type Role = 'user' | 'admin'
export async function setUserRoleAction(userId: string, role: Role | Role[]) {
  try {
    await checkAdmin()
    await auth.api.setRole({
      headers: await headers(),
      body: { userId, role }
    })
    revalidatePath('/admin/users')
    return actionSuccess(undefined)
  } catch (error: unknown) {
    return actionError(error)
  }
}
