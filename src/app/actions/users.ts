'use server'

import type { UserRole } from '@/types'

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

const revalidateUsers = () => {
  revalidatePath('/admin/users')
}

export async function banUserAction(userId: string, reason?: string) {
  try {
    await requireServerAdminSession()

    banUserSchema.parse({ userId, reason })
    await banUser(await headers(), userId, reason)

    revalidateUsers()
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

    revalidateUsers()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}

export async function setUserRoleAction(
  userId: string,
  role: UserRole | UserRole[]
) {
  try {
    await requireServerAdminSession()

    setUserRoleSchema.parse({ userId, role })
    await setUserRole(await headers(), userId, role)

    revalidateUsers()
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

    revalidateUsers()
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

    revalidateUsers()
    return success(null)
  } catch (error: unknown) {
    return failure(error)
  }
}
