import type { Metadata } from 'next'

import { getPhotos } from '@/data/photos'
import { getT } from '@/i18n/server'
import { PhotosPage } from '@/views/photos'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.photos.title')
  const description = t('metadata.photos.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const photos = await getPhotos()

  return <PhotosPage photos={photos} />
}

export const revalidate = 3600
