import type { UserWithRole } from 'better-auth/plugins'

import type { UserRole } from '@/types'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { requireServerAdminSession } from '@/lib/auth-session'

import 'server-only'

export async function getUsers() {
  await requireServerAdminSession()

  const result = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100 }
  })

  return result.users
}

export async function banUser(
  requestHeaders: Headers,
  userId: string,
  reason?: string
) {
  return auth.api.banUser({
    headers: requestHeaders,
    body: { userId, banReason: reason }
  })
}

export async function unbanUser(requestHeaders: Headers, userId: string) {
  return auth.api.unbanUser({
    headers: requestHeaders,
    body: { userId }
  })
}

export async function setUserRole(
  requestHeaders: Headers,
  userId: string,
  role: UserRole | UserRole[]
) {
  return auth.api.setRole({
    headers: requestHeaders,
    body: { userId, role }
  })
}

export async function getUser(
  requestHeaders: Headers,
  userId: string
): Promise<UserWithRole> {
  return auth.api.getUser({
    headers: requestHeaders,
    query: { id: userId }
  })
}

export async function updateUser(
  requestHeaders: Headers,
  userId: string,
  data: { name?: string; image?: string }
) {
  return auth.api.adminUpdateUser({
    headers: requestHeaders,
    body: { userId, data }
  })
}

export async function removeUser(requestHeaders: Headers, userId: string) {
  return auth.api.removeUser({
    headers: requestHeaders,
    body: { userId }
  })
}
