import type { Metadata } from 'next'

import { getPoemsAction } from '@/app/actions/poems'
import { description, PoemsPage, title } from '@/views/poems'

export const metadata = {
  title,
  description,
  openGraph: { title, description }
} satisfies Metadata

export default async function Page() {
  const result = await getPoemsAction()
  if (!result.success) throw new Error(result.error)

  return <PoemsPage poems={result.data} />
}
