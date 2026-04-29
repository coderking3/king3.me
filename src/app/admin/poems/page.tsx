import { getPoemsAction } from '@/actions/poems'
import { PoemsPage } from '@/views/admin'

export default async function Page() {
  const result = await getPoemsAction()

  return <PoemsPage poems={result.data || []} />
}
