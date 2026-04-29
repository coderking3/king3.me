import { getPhotosAction } from '@/actions/photos'
import { PhotosPage } from '@/views/admin'

export default async function Page() {
  const result = await getPhotosAction()

  return <PhotosPage photos={result.data || []} />
}
