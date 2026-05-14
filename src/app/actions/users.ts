'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import {
  banUser,
  getUser,
  removeUser,
  setUserRole,
  unbanUser,
  updateUser
} from '@/data/users'
import { requireServerAdminSession } from '@/lib/auth-session'
import { failure, success } from '@/lib/result'
import { idSchema } from '@/validations/common'
import {
  banUserSchema,
  setUserRoleSchema,
  updateUserSchema
} from '@/validations/users'

export async function banUserAction(userId: string, reason?: string) {
  try {
    await requireServerAdminSession()

    banUserSchema.parse({ userId, reason })
    await banUser(await headers(), userId, reason)

    revalidatePath('/admin/users')
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function unbanUserAction(userId: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(userId)
    await unbanUser(await headers(), userId)

    revalidatePath('/admin/users')
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

type Role = 'user' | 'admin'
export async function setUserRoleAction(userId: string, role: Role | Role[]) {
  try {
    await requireServerAdminSession()

    setUserRoleSchema.parse({ userId, role })
    await setUserRole(await headers(), userId, role)

    revalidatePath('/admin/users')
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function getUserAction(userId: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(userId)
    const result = await getUser(await headers(), userId)

    return success(result)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function updateUserAction(
  userId: string,
  data: { name?: string; image?: string }
) {
  try {
    await requireServerAdminSession()

    idSchema.parse(userId)
    updateUserSchema.parse(data)
    await updateUser(await headers(), userId, data)

    revalidatePath('/admin/users')
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function removeUserAction(userId: string) {
  try {
    await requireServerAdminSession()

    idSchema.parse(userId)
    await removeUser(await headers(), userId)

    revalidatePath('/admin/users')
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}
