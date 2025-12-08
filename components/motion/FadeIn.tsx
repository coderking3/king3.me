'use client'

import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.5
      }}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn
