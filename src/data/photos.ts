import type { Photo } from '@/types'
import type { PhotoInput } from '@/validations/photos'

import { desc, eq, inArray } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'

import { db } from '@/lib/db'
import { photo } from '@/lib/db/schema'

import 'server-only'

export async function getPhotos(): Promise<Photo[]> {
  'use cache'
  cacheLife('days')
  cacheTag('photos')

  const photos = await db
    .select({
      id: photo.id,
      name: photo.name,
      url: photo.url,
      width: photo.width,
      height: photo.height,
      date: photo.date,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt
    })
    .from(photo)
    .orderBy(desc(photo.date))

  return photos.map((p) => ({
    ...p,
    date: p.date.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }))
}

export function invalidatePhotos() {
  updateTag('photos')
}

export async function createPhoto(data: PhotoInput) {
  const [created] = await db.insert(photo).values(data).returning()
  return created
}

export async function createPhotos(data: PhotoInput[]) {
  const inserted = await db
    .insert(photo)
    .values(data)
    .returning({ id: photo.id })
  return inserted.length
}

export async function updatePhoto(id: string, data: PhotoInput) {
  const [updated] = await db
    .update(photo)
    .set(data)
    .where(eq(photo.id, id))
    .returning()
  return updated
}

export async function deletePhoto(id: string) {
  const [deleted] = await db.delete(photo).where(eq(photo.id, id)).returning()
  return deleted
}

export async function deletePhotos(ids: string[]) {
  const deleted = await db
    .delete(photo)
    .where(inArray(photo.id, ids))
    .returning({ id: photo.id })
  return deleted.length
}
