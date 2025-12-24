'use client'

import type { Variants } from 'framer-motion'

import type { SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface SunAndMoonProps extends SvgIcon {
  whileHover?: string
  whileTap?: string
  isLight?: boolean // true = 太阳, false = 月亮
  onClick?: () => void
}

export function SunAndMoon({
  size = '1.25rem',
  color = 'currentColor',
  strokeWidth = 2,
  className,
  whileHover,
  whileTap,
  isLight = true,
  onClick
}: SunAndMoonProps) {
  const hoverVariant = whileHover ?? 'hover'
  const tapVariant = whileTap ?? 'tap'

  const motionProps = {
    ...(whileHover === undefined && { whileHover: hoverVariant }),
    ...(whileTap === undefined && { whileTap: tapVariant })
  }

  const containerVariants: Variants = {
    initial: {},
    [hoverVariant]: {
      scale: 1.05,
      rotate: isLight ? 15 : -15
    },
    [tapVariant]: {
      scale: 0.95,
      rotate: 0
    }
  }

  // 太阳光芒
  const raysVariants: Variants = {
    initial: {},
    sun: {
      scale: 1,
      opacity: 1,
      rotate: 0
    },
    moon: {
      scale: 0.5,
      opacity: 0,
      rotate: -90
    },
    [hoverVariant]: {
      scale: 1.1,
      rotate: 22.5
    }
  }

  // 太阳/月亮主体圆形
  const circleVariants: Variants = {
    initial: {},
    sun: {
      scale: 1,
      cx: 12,
      cy: 12
    },
    moon: {
      scale: 0.85,
      cx: 12,
      cy: 12
    },
    [hoverVariant]: {
      scale: isLight ? 1.08 : 0.92
    }
  }

  // 月亮遮罩圆形（形成月牙效果）
  const maskVariants: Variants = {
    initial: {},
    sun: {
      cx: 25,
      cy: 8,
      scale: 0
    },
    moon: {
      cx: 16,
      cy: 8,
      scale: 1
    }
  }

  // 月亮陨石坑
  const craterVariants: Variants = {
    initial: {},
    sun: {
      opacity: 0,
      scale: 0
    },
    moon: {
      opacity: 0.3,
      scale: 1
    }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('cursor-pointer', className)}
      initial="initial"
      animate={isLight ? 'sun' : 'moon'}
      variants={containerVariants}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      onClick={onClick}
      {...motionProps}
    >
      <defs>
        <mask id="moon-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            variants={maskVariants}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            fill="black"
            r="6"
          />
        </mask>
      </defs>

      {/* 太阳光芒 */}
      <motion.g
        variants={raysVariants}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 20
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </motion.g>

      {/* 太阳/月亮主体 */}
      <motion.circle
        cx="12"
        cy="12"
        r="5"
        fill={color}
        stroke="none"
        mask="url(#moon-mask)"
        variants={circleVariants}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25
        }}
      />

      {/* 月亮陨石坑 */}
      <motion.g
        variants={craterVariants}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25
        }}
      >
        <circle cx="10" cy="10" r="1" fill={color} stroke="none" />
        <circle cx="14" cy="11" r="0.7" fill={color} stroke="none" />
        <circle cx="11" cy="13" r="0.5" fill={color} stroke="none" />
      </motion.g>
    </motion.svg>
  )
}

export default SunAndMoon
