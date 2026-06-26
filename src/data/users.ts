import type { UserWithRole } from 'better-auth/plugins'

import type { UserRole } from '@/types'

import { desc } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

import 'server-only'

export async function getUsers(): Promise<UserWithRole[]> {
  'use cache'
  cacheLife('days')
  cacheTag('users')

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      banExpires: user.banExpires,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
    .from(user)
    .orderBy(desc(user.createdAt))

  return users.map((u) => ({
    ...u,
    role: u.role ?? undefined,
    banReason: u.banReason ?? undefined,
    banExpires: u.banExpires ?? undefined
  }))
}

export function invalidateUsers() {
  updateTag('users')
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
