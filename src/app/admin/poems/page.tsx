import { getPoemsAction } from '@/app/actions/poems'
import { PoemsAdminPage } from '@/views/admin'

export default async function Page() {
  const result = await getPoemsAction()
  if (!result.success) throw new Error(result.error)

  return <PoemsAdminPage poems={result.data} />
}
