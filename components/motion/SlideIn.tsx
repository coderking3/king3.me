'use client'

import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

function SlideIn({
  children,
  direction = 'left'
}: {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
}) {
  const directions = {
    left: {
      x: -50
    },
    right: {
      x: 50
    },
    up: {
      y: -50
    },
    down: {
      y: 50
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        duration: 0.6
      }}
    >
      {children}
    </motion.div>
  )
}

export default SlideIn
