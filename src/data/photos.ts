import type { Photo } from '@/types'
import type { PhotoInput } from '@/validations/photos'

import { cache } from 'react'

import { prisma } from '@/lib/prisma'

import 'server-only'

export const getPhotos = cache(async (): Promise<Photo[]> => {
  const photos = await prisma.photo.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      width: true,
      height: true,
      date: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { date: 'desc' }
  })

  return photos.map((photo) => ({
    ...photo,
    date: photo.date.toISOString(),
    createdAt: photo.createdAt.toISOString(),
    updatedAt: photo.updatedAt.toISOString()
  }))
})

export async function createPhoto(data: PhotoInput) {
  return prisma.photo.create({ data })
}

export async function createPhotos(data: PhotoInput[]) {
  const { count } = await prisma.photo.createMany({ data })

  return count
}

export async function updatePhoto(id: string, data: PhotoInput) {
  return prisma.photo.update({ where: { id }, data })
}

export async function deletePhoto(id: string) {
  return prisma.photo.delete({ where: { id } })
}

export async function deletePhotos(ids: string[]) {
  const { count } = await prisma.photo.deleteMany({
    where: { id: { in: ids } }
  })

  return count
}
