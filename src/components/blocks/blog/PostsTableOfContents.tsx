'use client'

import type { TocItem } from '@/types'

import { useEffect, useState } from 'react'

interface PostsDirectoryProps {
  headings: TocItem[]
}

function PostsDirectory({ headings }: PostsDirectoryProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66% 0px' }
    )

    const headingElements = headings.map(({ id }) =>
      document.getElementById(id)
    )

    headingElements.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => {
      headingElements.forEach((el) => {
        if (el) observer.unobserve(el)
      })
    }
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 h-fit">
      <div className="text-foreground mb-4 text-sm font-semibold">目录</div>
      <ul className="border-border space-y-2.5 border-l-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className="relative"
            style={{ paddingLeft: `${(heading.level - 2) * 0.75 + 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`hover:text-brand block text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-brand font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {heading.text}
            </a>
            {activeId === heading.id && (
              <span className="bg-brand absolute top-0 -left-[2px] h-full w-[2px]" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default PostsDirectory
