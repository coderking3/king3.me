/* eslint-disable perfectionist/sort-imports */
import 'dotenv/config'

import process from 'node:process'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { dash } from '@better-auth/infra'

import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,

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

// 导出类型，客户端侧类型推断用
export type Auth = typeof auth

// 获取 auth session
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return session
}

// 检查是否为管理员
export async function checkAdmin() {
  const session = await getSession()

  if (!session || session.user.role !== 'admin') {
    throw new Error('无权限进行此操作')
  }

  return session
}
