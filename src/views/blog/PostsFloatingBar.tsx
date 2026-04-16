'use client'

import type { TocItem } from '@/types'

import { useScroll } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronsRight, List, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui'
import { Back, ChevronUp, LinkIcon } from '@/icons'
import { cn } from '@/lib/utils'

import PostsTableOfContents from './PostsTableOfContents'

const glassClass =
  'from-background/70 to-background/90 border-border/70 dark:border-border shadow-muted-foreground/7 flex items-center rounded-full border bg-linear-to-b shadow-lg backdrop-blur-xs backdrop-saturate-150'

const actionButtonClass =
  'group flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200'

interface PostsFloatingBarProps {
  headings: TocItem[]
}

function PostsFloatingBar({ headings }: PostsFloatingBarProps) {
  const { t } = useTranslation('blog')

  const [visible, setVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  const visibleRef = useRef(false)

  useScroll({
    onChange: ({ value: { scrollY } }) => {
      const shouldShow = scrollY > 400
      if (shouldShow !== visibleRef.current) {
        visibleRef.current = shouldShow
        setVisible(shouldShow)
      }
    }
  })

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCopyLink = useCallback(async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [copied])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-4 z-40 xl:hidden"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              left: collapsed ? '1rem' : '50%',
              x: collapsed ? 0 : '-50%'
            }}
          >
            <motion.div
              layout
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {collapsed ? (
                  <motion.button
                    key="collapsed"
                    type="button"
                    onClick={() => setCollapsed(false)}
                    className={cn(glassClass, 'h-11 w-11 justify-center')}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Expand toolbar"
                  >
                    <ChevronsRight
                      size={18}
                      className="text-muted-foreground"
                    />
                  </motion.button>
                ) : (
                  <motion.div
                    key="expanded"
                    className={cn(glassClass, 'h-11 gap-1 px-1.5')}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Back to blog */}
                    <Back
                      href="/blog"
                      className={actionButtonClass}
                      alt="Return to blog list"
                    />

                    {/* Copy link */}
                    <div
                      onClick={handleCopyLink}
                      className={cn(
                        actionButtonClass,
                        'relative overflow-hidden',
                        copied && 'text-brand hover:text-brand'
                      )}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          >
                            <Check size={18} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="link"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          >
                            <LinkIcon />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="sr-only">Copy link</span>
                    </div>

                    <div className="bg-border mx-0.5 h-5 w-px" />

                    {/* TOC */}
                    {headings.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setTocOpen(true)}
                        className={actionButtonClass}
                        aria-label="Table of contents"
                      >
                        <List size={18} />
                      </button>
                    )}

                    {/* Scroll to top */}
                    <ChevronUp
                      onClick={scrollToTop}
                      className={actionButtonClass}
                      alt="Back to top"
                    />

                    <div className="bg-border mx-0.5 h-5 w-px" />

                    {/* Collapse */}
                    <button
                      type="button"
                      onClick={() => setCollapsed(true)}
                      className={actionButtonClass}
                      aria-label="Collapse toolbar"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOC Sheet */}
      {headings.length > 0 && (
        <Sheet open={tocOpen} onOpenChange={setTocOpen}>
          <SheetContent side="bottom" className="max-h-[60vh]">
            <SheetHeader>
              <SheetTitle>{t('toc')}</SheetTitle>
            </SheetHeader>
            <div
              className="overflow-y-auto px-4 pb-4"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a')) {
                  setTocOpen(false)
                }
              }}
            >
              <PostsTableOfContents headings={headings} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

export default PostsFloatingBar
