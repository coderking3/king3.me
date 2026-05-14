/* eslint-disable perfectionist/sort-imports */

import process from 'node:process'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { dash } from '@better-auth/infra'

import { prisma } from '@/lib/prisma'
import { getServerSession } from './auth-session'

export const ADMIN_USER_ROLE = 'admin' as const

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),

  // OAuth
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scopes: ['user:email', 'read:user']
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ['openid', 'email', 'profile']
    }
  },

  plugins: [admin(), dash(), nextCookies()]
})

export type Auth = typeof auth

// Check if it is an administrator
export async function checkAdmin() {
  const session = await getServerSession()

  if (!session || session.user.role !== ADMIN_USER_ROLE) {
    throw new Error('No permission to perform this operation')
  }

  return session
}
