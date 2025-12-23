'use client'

import type { Variants } from 'framer-motion'

import type { SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface CameraProps extends SvgIcon {
  whileHover?: string
  whileTap?: string
}

export function Camera({
  size = '1.25rem',
  color = 'currentColor',
  strokeWidth = 2,
  className,
  whileHover,
  whileTap
}: CameraProps) {
  const hoverVariant = whileHover ?? 'hover'
  const tapVariant = whileTap ?? 'tap'

  // 只在没有外部传入时才添加 whileHover 和 whileTap
  const motionProps = {
    ...(whileHover === undefined && { whileHover: hoverVariant }),
    ...(whileTap === undefined && { whileTap: tapVariant })
  }

  const containerVariants: Variants = {
    initial: {},
    [hoverVariant]: {
      scale: 1.05,
      rotate: 3
    },
    [tapVariant]: {
      scale: 0.97,
      rotate: 0
    }
  }

  const bodyVariants: Variants = {
    initial: {},
    [hoverVariant]: { scale: 1.05 },
    [tapVariant]: { scale: 0.95 }
  }

  const lensVariants: Variants = {
    initial: {},
    [tapVariant]: { scale: 0.8 }
  }

  const flashVariants: Variants = {
    initial: {
      opacity: 1,
      scale: 1
    },
    [hoverVariant]: {
      opacity: [1, 0.1, 1],
      scale: [1, 1.2, 1]
    }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn(className)}
      strokeWidth={strokeWidth}
      initial="initial"
      variants={containerVariants}
      transition={{
        type: 'spring',
        stiffness: 300
      }}
      {...motionProps}
    >
      {/* 相机机身 */}
      <motion.path
        className="camera-body"
        fill={color}
        d="M4 21q-.825 0-1.412-.587Q2 19.825 2 19V7q0-.825.588-1.412Q3.175 5 4 5h3.15L8.7 3.325q.15-.15.337-.238Q9.225 3 9.425 3h5.15q.2 0 .388.087q.187.088.337.238L16.85 5H20q.825 0 1.413.588Q22 6.175 22 7v12q0 .825-.587 1.413Q20.825 21 20 21Zm16-2V7h-4.05l-1.825-2h-4.25L8.05 7H4v12Z"
        variants={bodyVariants}
        transition={{
          scale: { type: 'spring', stiffness: 400, damping: 17 },
          default: { duration: 0.3 }
        }}
        style={{ originX: '50%', originY: '50%' }}
      />

      {/* 镜头圆环 */}
      <motion.path
        className="lens-ring"
        fill={color}
        fillRule="evenodd"
        d="M12 18q2.075 0 3.538-1.462Q17 15.075 17 13q0-2.075-1.462-3.538Q14.075 8 12 8Q9.925 8 8.463 9.462Q7 10.925 7 13q0 2.075 1.463 3.538Q9.925 18 12 18Zm0-2q-1.25 0-2.125-.875T9 13q0-1.25.875-2.125T12 10q1.25 0 2.125.875T15 13q0 1.25-.875 2.125T12 16Z"
        variants={lensVariants}
        transition={{
          scale: { type: 'spring', stiffness: 400, damping: 17 },
          default: { duration: 0.3 }
        }}
      />

      {/* 闪光灯 */}
      <motion.circle
        className="flash"
        cx="18"
        cy="9"
        r="1"
        fill={color}
        variants={flashVariants}
      />
    </motion.svg>
  )
}

export default Camera
