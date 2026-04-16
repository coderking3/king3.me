import type { Metadata } from 'next'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { getT } from '@/i18n/server'
import { extractHeadings } from '@/lib/posts'
import { UsePage } from '@/views/use'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common')

  const title = t('metadata.use.title')
  const description = t('metadata.use.description')

  return { title, description, openGraph: { title, description } }
}

export default async function Page() {
  const content = await fs.readFile(
    path.join(process.cwd(), 'content/use.md'),
    'utf-8'
  )

  const headings = extractHeadings(content)

  return <UsePage content={content} headings={headings} />
}
