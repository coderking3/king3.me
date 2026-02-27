'use client'

import type { TocItem } from '@/types'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface PostsDirectoryProps {
  headings: TocItem[]
}

const SCROLL_OFFSET = 100
const TOC_TITLE = 'Table of Contents'

const LEVEL_CLASSES: Record<number, string> = {
  2: 'mt-3 pl-2',
  3: 'mt-1 pl-5',
  4: 'mt-1 pl-8',
  5: 'mt-1 pl-11',
  6: 'mt-1 pl-14'
}

function useActiveHeading(headings: TocItem[]) {
  const [activeId, setActiveId] = useState<string>('')
  const offsetsRef = useRef<{ id: string; top: number }[]>([])

  useEffect(() => {
    const recalc = () => {
      offsetsRef.current = headings
        .map(({ id }) => {
          const el = document.getElementById(id)
          return el
            ? { id, top: el.getBoundingClientRect().top + window.scrollY }
            : null
        })
        .filter(Boolean) as { id: string; top: number }[]
    }

    recalc()
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [headings])

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + SCROLL_OFFSET + 16
      let current = offsetsRef.current[0]?.id ?? ''
      for (const { id, top } of offsetsRef.current) {
        if (scrollY >= top) current = id
        else break
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [headings])

  return activeId
}

function PostsTableOfContents({ headings }: PostsDirectoryProps) {
  const activeId = useActiveHeading(headings)

  if (headings.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav aria-label={TOC_TITLE} className="h-fit">
      <p className="text-foreground mb-1 text-sm font-semibold tracking-wide uppercase">
        {TOC_TITLE}
      </p>

      {headings.map((heading) => {
        const isActive = activeId === heading.id
        const levelClass = LEVEL_CLASSES[heading.level] ?? ''

        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            aria-current={isActive ? 'location' : undefined}
            onClick={(e) => handleClick(e, heading.id)}
            className={cn(
              'block text-sm leading-snug transition-colors duration-150',
              levelClass,
              isActive
                ? 'text-brand font-medium'
                : 'text-muted-foreground hover:text-brand'
            )}
          >
            <span className="block py-0.5">{heading.text}</span>
          </a>
        )
      })}
    </nav>
  )
}

export default PostsTableOfContents
