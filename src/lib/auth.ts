import process from 'node:process'

import { dash } from '@better-auth/infra'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'

import { db } from './db'

export const ADMIN_USER_ROLE = 'admin' as const

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg'
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
