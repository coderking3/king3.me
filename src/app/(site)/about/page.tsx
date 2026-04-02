import type { Metadata } from 'next'

import { AboutPage, description, title } from '@/views/about'

export const metadata = {
  title,
  description,
  openGraph: { title, description }
} satisfies Metadata

export default function Page() {
  return <AboutPage />
}
