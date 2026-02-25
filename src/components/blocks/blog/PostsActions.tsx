'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

function PostsActions() {
  const router = useRouter()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <nav className="flex flex-col items-center gap-3">
      {/* 返回博客列表 */}
      <button
        onClick={() => router.push('/blog')}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-xl',
          'bg-secondary/80 text-muted-foreground',
          'hover:bg-accent hover:text-foreground',
          'transition-all duration-200'
        )}
        aria-label="返回博客列表"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>

      {/* 复制链接 */}
      <button
        onClick={handleCopyLink}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-xl',
          'bg-secondary/80 text-muted-foreground',
          'hover:bg-accent hover:text-foreground',
          'transition-all duration-200',
          copied && 'text-brand bg-brand/10'
        )}
        aria-label="复制链接"
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>

      {/* 分隔线 */}
      <div className="bg-border my-1 h-px w-5" />

      {/* 回到顶部 */}
      <button
        onClick={scrollToTop}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-xl',
          'bg-secondary/80 text-muted-foreground',
          'hover:bg-accent hover:text-foreground',
          'transition-all duration-200',
          !showScrollTop && 'pointer-events-none opacity-30'
        )}
        aria-label="回到顶部"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </nav>
  )
}

export default PostsActions
