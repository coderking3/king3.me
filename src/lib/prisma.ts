/* eslint-disable perfectionist/sort-imports */
import 'dotenv/config'
import 'server-only'

import process from 'node:process'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '~/prisma/generated/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
