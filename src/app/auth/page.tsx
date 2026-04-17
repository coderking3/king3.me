import type { Metadata } from 'next'

import { getT } from '@/i18n/server'
import { AuthPage } from '@/views/auth'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.auth.title')
  const description = t('metadata.auth.description')

  return { title, description, openGraph: { title, description } }
}

export default function Page() {
  return <AuthPage />
}
