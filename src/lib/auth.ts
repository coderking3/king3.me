/* eslint-disable perfectionist/sort-imports */
import 'dotenv/config'
// import 'server-only'

import process from 'node:process'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'

import { prisma } from '@/lib/prisma'

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

  plugins: [nextCookies()]
})

// 导出类型，客户端侧类型推断用
export type Auth = typeof auth
