'use client'

import type { TocItem } from '@/types'

import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface PostsDirectoryProps {
  headings: TocItem[]
}

interface TocSection {
  heading: TocItem
  children: TocItem[]
}

const SCROLL_OFFSET = 100

const CHILD_CLASSES: Record<number, string> = {
  3: 'mt-1 pl-7 text-sm',
  4: 'mt-1 pl-10 text-sm',
  5: 'mt-1 pl-13 text-sm',
  6: 'mt-1 pl-16 text-sm'
}

export const ARTICLE_TITLE = 'article-title'

function groupHeadings(headings: TocItem[]): TocSection[] {
  const sections: TocSection[] = []

  for (const heading of headings) {
    if (heading.level === 2) {
      sections.push({ heading, children: [] })
    } else if (sections.length > 0) {
      sections[sections.length - 1].children.push(heading)
    } else {
      // Heading before any h2 — treat as standalone section
      sections.push({ heading, children: [] })
    }
  }

  return sections
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
  const { t } = useTranslation('blog')
  const activeId = useActiveHeading(headings)
  const navRef = useRef<HTMLElement>(null)
  const sections = useMemo(() => groupHeadings(headings), [headings])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  // Auto-expand section containing the active heading
  useEffect(() => {
    if (!activeId) return

    for (const section of sections) {
      const isChild = section.children.some((c) => c.id === activeId)
      if (isChild && !expandedIds.has(section.heading.id)) {
        setExpandedIds((prev) => new Set(prev).add(section.heading.id))
        break
      }
    }
  }, [activeId, sections, expandedIds])

  // Auto-scroll TOC to keep active item visible
  useEffect(() => {
    if (!activeId || !navRef.current) return
    const el = navRef.current.querySelector(`[href="#${CSS.escape(activeId)}"]`)
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeId])

  if (headings.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <nav
      ref={navRef}
      aria-label={t('toc')}
      className="scrollbar-none max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <a
        className="hidden sm:inline-block"
        href={`#${ARTICLE_TITLE}`}
        onClick={(e) => handleClick(e, ARTICLE_TITLE)}
      >
        <p className="text-foreground mb-1 text-sm font-semibold tracking-wide uppercase">
          {t('toc')}
        </p>
      </a>

      {sections.map((section) => {
        const { heading, children } = section
        const hasChildren = children.length > 0
        const isExpanded = expandedIds.has(heading.id)
        const isActive = activeId === heading.id

        return (
          <div key={heading.id} className="mt-3">
            <div className="flex items-start">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleSection(heading.id)}
                  className="text-muted-foreground hover:text-foreground flex h-[calc(1em*1.375+4px)] w-4 shrink-0 cursor-pointer items-center justify-center text-sm leading-snug transition-colors"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <ChevronRight
                    size={12}
                    className={cn(
                      'transition-transform duration-200',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  'block text-sm leading-snug transition-colors duration-150',
                  isActive
                    ? 'text-brand font-medium'
                    : 'text-muted-foreground hover:text-brand'
                )}
              >
                <span className="block py-0.5">{heading.text}</span>
              </a>
            </div>

            {hasChildren && (
              <div
                className={cn(
                  'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
                  isExpanded
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  {children.map((child) => {
                    const isChildActive = activeId === child.id
                    const levelClass = CHILD_CLASSES[child.level] ?? ''

                    return (
                      <a
                        key={child.id}
                        href={`#${child.id}`}
                        aria-current={isChildActive ? 'location' : undefined}
                        onClick={(e) => handleClick(e, child.id)}
                        className={cn(
                          'block text-sm leading-snug transition-colors duration-150',
                          levelClass,
                          isChildActive
                            ? 'text-brand font-medium'
                            : 'text-muted-foreground hover:text-brand'
                        )}
                      >
                        <span className="block py-0.5">{child.text}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default PostsTableOfContents
