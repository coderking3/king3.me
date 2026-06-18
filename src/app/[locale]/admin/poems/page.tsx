import { getPoems } from '@/data/poems'
import { PoemsPage } from '@/views/admin'

export default async function Page() {
  const poems = (await getPoems()) || []

  return <PoemsPage poems={poems} />
}
