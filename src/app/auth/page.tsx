import { createPageMetadata } from '@/lib/metadata'
import { AuthPage } from '@/views/auth'

export const metadata = createPageMetadata('auth')

export default function Page() {
  return <AuthPage />
}
