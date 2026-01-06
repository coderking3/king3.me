import type { Variants } from 'framer-motion'

import type { SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

import style from './style.module.css'

interface LogoProps extends SvgIcon {}

function Logo({
  size = '1.25rem',
  color = 'currentColor',
  strokeWidth = 1.5,
  className
}: LogoProps) {
  const isDefaultSize = size === '1.25rem'
  const whileHover = 'hover'
  const whileTap = 'tap'
  const motionProps = { whileHover, whileTap }

  const iconVariants: Variants = {
    initial: {
      scale: 1,
      scaleX: 1,
      scaleY: 1
    },
    [whileHover]: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 0.4,
        ease: 'easeInOut'
      }
    },
    [whileTap]: {
      scaleX: 0.85,
      scaleY: 1.08,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15
      }
    }
  }

  return (
    <motion.div
      className={cn(
        style['logo-animate'],
        `flex items-center justify-center`,
        { 'size-5': isDefaultSize },
        className
      )}
      style={{
        ...(!isDefaultSize && { width: size, height: size })
      }}
      initial="initial"
      variants={iconVariants}
      {...motionProps}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-full"
        fill="none"
        strokeWidth={strokeWidth}
      >
        <path d="M8 12H17" stroke={color} className={style['divider-line']} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.2882 3.25L2.59238 19.6487L2.00836 20.7501H3.25499H3.66804L11.3418 6.27864L12.0044 5.02909L12.667 6.27864L20.3408 20.7501H20.754H22.0006L21.4166 19.6487L12.7208 3.25H11.2882Z"
          fill={color}
          className={style['arrow-up']}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.25499 3.25H3.66807L11.3418 17.7214L12.0044 18.9709L12.667 17.7214L20.3408 3.25H20.754H22.0006L21.4166 4.35136L12.7208 20.75H11.2881L2.59238 4.35136L2.00836 3.25H3.25499Z"
          fill={color}
          className={style['arrow-down']}
        />
      </motion.svg>
    </motion.div>
  )
}

export default Logo
