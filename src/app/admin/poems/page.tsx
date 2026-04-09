import { getPoemsAction } from '@/app/actions/poems'
import { PoemsPage } from '@/views/admin'

export default async function Page() {
  const result = await getPoemsAction()
  if (!result.success) throw new Error(result.error)

  return <PoemsPage poems={result.data} />
}
