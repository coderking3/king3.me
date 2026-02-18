import type { TocItem } from '@/types'

import GithubSlugger from 'github-slugger'

export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(\S.*)$/gm
  const headings: TocItem[] = []
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    // 使用 github-slugger 生成与 rehype-slug 一致的id
    const id = slugger.slug(text)

    headings.push({ id, text, level })
  }

  return headings
}
