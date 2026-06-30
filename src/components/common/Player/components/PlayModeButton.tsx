import type { MotionOptions } from '@/types'

import { AnimatePresence } from 'framer-motion'
import { Repeat, Repeat1, Shuffle } from 'lucide-react'

import { Animated } from '@/components/common'
import { cn } from '@/lib/utils'

export type PlayMode = 'order' | 'shuffle' | 'repeat'

export function PlayModeButton({
  mode,
  onCycle
}: {
  mode: PlayMode
  onCycle: () => void
}) {
  const btnTitle =
    mode === 'order' ? 'Order' : mode === 'shuffle' ? 'Shuffle' : 'Repeat one'

  const btnClassName = cn(
    'transition',
    mode === 'order'
      ? 'text-muted-foreground hover:text-foreground'
      : 'text-brand'
  )

  const animation: MotionOptions = {
    initial: { opacity: 0, rotate: -20, scale: 0.7 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 20, scale: 0.7 },
    transition: { duration: 0.15 }
  }

  return (
    <button
      onClick={onCycle}
      className={btnClassName}
      aria-label={mode}
      title={btnTitle}
    >
      <AnimatePresence mode="wait" initial={false}>
        <Animated as="span" key={mode} className="flex" animation={animation}>
          {mode === 'order' && <Repeat size={15} />}
          {mode === 'shuffle' && <Shuffle size={15} />}
          {mode === 'repeat' && <Repeat1 size={15} />}
        </Animated>
      </AnimatePresence>
    </button>
  )
}
