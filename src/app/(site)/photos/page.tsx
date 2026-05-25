import { getPhotos } from '@/data/photos'
import { createPageMetadata } from '@/lib/metadata'
import { PhotosPage } from '@/views/photos'

export const metadata = createPageMetadata('photos')

export default async function Page() {
  const photos = await getPhotos()

  return <PhotosPage photos={photos} />
}

export const revalidate = 3600
