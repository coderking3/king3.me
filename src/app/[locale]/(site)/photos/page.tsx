import { getTranslations } from 'next-intl/server'

import { getPhotos } from '@/data/photos'
import { PhotosPage } from '@/views/photos'

export async function generateMetadata() {
  const t = await getTranslations('metadata.photos')
  const title = t('title')
  const description = t('description')

  return {
    title,
    description,
    openGraph: {
      title,
      description
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image'
    }
  }
}

export default async function Page() {
  const photos = await getPhotos()

  return <PhotosPage photos={photos} />
}
