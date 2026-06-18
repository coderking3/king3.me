import { getPhotos } from '@/data/photos'
import { PhotosPage } from '@/views/admin'

export default async function Page() {
  const photos = (await getPhotos()) || []

  return <PhotosPage photos={photos} />
}
