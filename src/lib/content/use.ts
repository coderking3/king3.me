import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { cacheLife, cacheTag } from 'next/cache'

export async function getUseContent(lang: string) {
  'use cache'
  cacheLife('max')
  cacheTag('use-content')

  const filename = lang === 'en' ? 'use.mdx' : 'use_zh.mdx'
  const content = await fs.readFile(
    path.join(process.cwd(), 'content', filename),
    'utf-8'
  )
  return { content }
}
