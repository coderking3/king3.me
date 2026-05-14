import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

export async function getUseContent(lang: string) {
  const filename = lang === 'en' ? 'use.mdx' : 'use_zh.mdx'
  const content = await fs.readFile(
    path.join(process.cwd(), 'content', filename),
    'utf-8'
  )
  return { content }
}
