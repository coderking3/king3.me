import type { Variants } from 'framer-motion'

import type { SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

import style from './style.module.css'
interface LogoProps extends SvgIcon {
  whileHover?: string
  whileTap?: string
}

function Logo({
  size = '1.25rem',
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
  whileHover,
  whileTap
}: LogoProps) {
  const hoverVariant = whileHover ?? 'hover'
  const tapVariant = whileTap ?? 'tap'

  const motionProps = {
    ...(whileHover === undefined && { whileHover: hoverVariant }),
    ...(whileTap === undefined && { whileTap: tapVariant })
  }

  const containerVariants: Variants = {
    initial: {},
    [hoverVariant]: {
      scale: 1.05
    },
    [tapVariant]: {}
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className, style['logo-animate'])}
      variants={containerVariants}
      strokeWidth={strokeWidth}
      transition={{
        scale: { type: 'spring', stiffness: 400, damping: 17 },
        default: { duration: 0.3 }
      }}
      {...motionProps}
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
  )
}

export default Logo
