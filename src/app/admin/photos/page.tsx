import { getPhotosAction } from '@/app/actions/photos'
import { PhotosPage } from '@/views/admin'

export default async function Page() {
  const result = await getPhotosAction()
  if (!result.success) throw new Error(result.error)

  return <PhotosPage photos={result.data} />
}
