import type { Metadata } from 'next'

import { getPhotosAction } from '@/app/actions/photos'
import { description, PhotosPage, title } from '@/views/photos'

export const metadata = {
  title,
  description,
  openGraph: { title, description }
} satisfies Metadata

export default async function Page() {
  const result = await getPhotosAction()
  if (!result.success) throw new Error(result.error)

  return <PhotosPage photos={result.data} />
}

export const revalidate = 3600
