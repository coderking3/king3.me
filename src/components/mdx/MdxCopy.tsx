import type { MotionOptions } from '@/types'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks'
import { cn } from '@/lib/utils'

function MdxCopy({ value, className }: { value: string; className?: string }) {
  const { copied, copy } = useCopyToClipboard()

  const animation: MotionOptions = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, ease: 'easeOut' }
  }

  return (
    <button
      className={cn('copy-btn', className, copied && 'opacity-100')}
      onClick={() => copy(value)}
      aria-label="Copy to clipboard"
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="copied" {...animation}>
            <Check size={16} />
          </motion.span>
        ) : (
          <motion.span key="copy" {...animation}>
            <Copy size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default MdxCopy
