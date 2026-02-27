'use client'

import { useScroll } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'

import { ArrowLeft } from '@/icons/ArrowLeft'
import { ChevronUp } from '@/icons/ChevronUp'
import { Link } from '@/icons/Link'
import { cn } from '@/lib/utils'

const actionButtonClass = [
  'group flex h-10 w-10 items-center justify-center rounded-xl',
  'dark:bg-secondary/80 text-muted-foreground hover:bg-accent/30 hover:dark:bg-accent hover:text-foreground  border-border/50 hover:border-border/80 hover:dark:border-border border',
  'transition-all duration-200'
]

function PostsActions() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copied, setCopied] = useState(false)

  useScroll({
    onChange: ({ value: { scrollY } }) => {
      setShowScrollTop(scrollY > 400)
    }
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyLink = () => {
    if (copied) return

    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <nav className="flex flex-col items-center gap-3">
      {/* 返回博客列表 */}
      <ArrowLeft
        href="/blog"
        className={cn(...actionButtonClass)}
        alt="Return to blog list"
      />

      {/* 复制链接 */}
      <div
        onClick={handleCopyLink}
        className={cn(
          ...actionButtonClass,
          'relative overflow-hidden',
          copied && 'text-brand bg-brand/5 dark:bg-brand/10 hover:text-brand'
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ y: 20, opacity: 0 }} // 从下进入
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }} // 向下退出
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Check size={18} />
            </motion.span>
          ) : (
            <motion.span
              key="link"
              initial={{ y: -20, opacity: 0 }} // 从上进入
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }} // 向上退出
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Link className="hover:text-foreground hover:dark:text-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Copy link</span>
      </div>

      {/* 分隔线 */}
      <div className="bg-border my-1 h-px w-5" />

      {/* 回到顶部 */}
      <ChevronUp
        onClick={scrollToTop}
        className={cn(
          ...actionButtonClass,
          !showScrollTop && 'pointer-events-none opacity-30'
        )}
        alt="Back to top"
      />
    </nav>
  )
}

export default PostsActions
