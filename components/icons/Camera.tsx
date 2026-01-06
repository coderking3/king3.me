'use client'

import type { Variants } from 'framer-motion'

import type { SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface CameraProps extends SvgIcon {}

const cameraVariants: Record<'container' | 'lens' | 'flash', Variants> = {
  container: {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: [1, 1.08, 1],
      rotate: [0, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        times: [0, 0.2, 0.5, 1]
      }
    },
    tap: {
      scale: 0.92,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    }
  },
  lens: {
    initial: { scale: 1 },
    hover: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    tap: { scale: 0.9 }
  },
  flash: {
    initial: {
      opacity: 1
    },
    hover: {
      opacity: [1, 0.1, 1],
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }
}

export function Camera({
  size = '1.25rem',
  color = 'currentColor',
  className
}: CameraProps) {
  const isDefaultSize = size === '1.25rem'

  return (
    <motion.span
      className={cn(
        `inline-flex items-center justify-center`,
        { 'size-5': isDefaultSize },
        className
      )}
      style={{
        ...(!isDefaultSize && { width: size, height: size })
      }}
      initial="initial"
      variants={cameraVariants.container}
      whileHover="hover"
      whileTap="tap"
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        {/* 相机机身 */}
        <motion.path
          fill={color}
          d="M4 21q-.825 0-1.412-.587Q2 19.825 2 19V7q0-.825.588-1.412Q3.175 5 4 5h3.15L8.7 3.325q.15-.15.337-.238Q9.225 3 9.425 3h5.15q.2 0 .388.087q.187.088.337.238L16.85 5H20q.825 0 1.413.588Q22 6.175 22 7v12q0 .825-.587 1.413Q20.825 21 20 21Zm16-2V7h-4.05l-1.825-2h-4.25L8.05 7H4v12Z"
        />

        {/* 镜头圆环 */}
        <motion.path
          fill={color}
          fillRule="evenodd"
          d="M12 18q2.075 0 3.538-1.462Q17 15.075 17 13q0-2.075-1.462-3.538Q14.075 8 12 8Q9.925 8 8.463 9.462Q7 10.925 7 13q0 2.075 1.463 3.538Q9.925 18 12 18Zm0-2q-1.25 0-2.125-.875T9 13q0-1.25.875-2.125T12 10q1.25 0 2.125.875T15 13q0 1.25-.875 2.125T12 16Z"
          variants={cameraVariants.lens}
        />

        {/* 闪光灯 */}
        <motion.circle
          cx="18"
          cy="9"
          r="1"
          fill={color}
          variants={cameraVariants.flash}
        />
      </svg>
    </motion.span>
  )
}
