import { createPageMetadata } from '@/lib/metadata'
import { AboutPage } from '@/views/about'

export const metadata = createPageMetadata('about')

export default function Page() {
  return <AboutPage />
}
