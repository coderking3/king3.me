import type { Metadata } from 'next'

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { extractHeadings } from '@/lib/posts'
import { description, title, UsePage } from '@/views/use'

export const metadata = {
  title,
  description,
  openGraph: { title, description }
} satisfies Metadata

export default async function Page() {
  const content = await fs.readFile(
    path.join(process.cwd(), 'content/use.md'),
    'utf-8'
  )

  const headings = extractHeadings(content)

  return <UsePage content={content} headings={headings} />
}
