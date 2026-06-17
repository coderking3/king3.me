import type { Poem } from '@/types'
import type { PoemInput } from '@/validations/poems'

import { desc, eq, inArray } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

import { db } from '@/lib/db'
import { poem } from '@/lib/db/schema'

import 'server-only'

export async function getPoems(): Promise<Poem[]> {
  'use cache'
  cacheLife('days')
  cacheTag('poems')

  const poems = await db
    .select({
      id: poem.id,
      title: poem.title,
      author: poem.author,
      content: poem.content,
      date: poem.date,
      createdAt: poem.createdAt,
      updatedAt: poem.updatedAt
    })
    .from(poem)
    .orderBy(desc(poem.createdAt))

  return poems.map((p) => ({
    ...p,
    date: p.date.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }))
}

export function invalidatePoems() {
  updateTag('poems')
}

export async function createPoem(data: PoemInput) {
  const [created] = await db.insert(poem).values(data).returning()
  return created
}

export async function updatePoem(id: string, data: PoemInput) {
  const [updated] = await db
    .update(poem)
    .set(data)
    .where(eq(poem.id, id))
    .returning()
  return updated
}

export async function deletePoem(id: string) {
  const [deleted] = await db.delete(poem).where(eq(poem.id, id)).returning()
  return deleted
}

export async function deletePoems(ids: string[]) {
  const deleted = await db
    .delete(poem)
    .where(inArray(poem.id, ids))
    .returning({ id: poem.id })
  return deleted.length
}
