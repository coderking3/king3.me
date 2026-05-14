import type { UserRole } from '@/types'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ADMIN_USER_ROLE, auth } from './auth'

export async function getServerSession(requestHeaders?: Headers) {
  return auth.api.getSession({
    headers: requestHeaders ?? (await headers())
  })
}

export type AuthenticatedServerSession = NonNullable<
  Awaited<ReturnType<typeof getServerSession>>
>

const isUserRole = (value: unknown): value is UserRole =>
  value === 'admin' || value === 'user'

export function getSessionUserRole(
  session: AuthenticatedServerSession
): UserRole | undefined {
  const { user } = session

  if (!('role' in user) || !isUserRole(user.role)) {
    return undefined
  }

  return user.role
}

export async function requireServerSession(requestHeaders?: Headers) {
  const session = await getServerSession(requestHeaders)

  if (!session) {
    redirect('/auth')
  }

  return session
}

export async function requireServerAdminSession(requestHeaders?: Headers) {
  const session = await requireServerSession(requestHeaders)

  if (getSessionUserRole(session) !== ADMIN_USER_ROLE) {
    throw new Error('Admin access required')
  }

  return session
}
