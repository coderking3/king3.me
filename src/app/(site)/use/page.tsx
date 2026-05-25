import { createPageMetadata } from '@/lib/metadata'
import { UsePage } from '@/views/use'

export const metadata = createPageMetadata('use')

export default async function Page() {
  return <UsePage />
}
