import { getPoems } from '@/data/poems'
import { createPageMetadata } from '@/lib/metadata'
import { PoemsPage } from '@/views/poems'

export const metadata = createPageMetadata('poems')

export default async function Page() {
  const poems = await getPoems()

  return <PoemsPage poems={poems} />
}
