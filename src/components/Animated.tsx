'use client'

import type { Easing, HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

import type { MotionOptions } from '@/types'

import { motion } from 'framer-motion'

type MotionElement = keyof typeof motion

const EASE_FUNCTION: Easing = [0.22, 1, 0.36, 1]

// 预设动画效果
export const animationPresets = {
  fadeIn: (delay = 0): MotionOptions => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      delay,
      ease: EASE_FUNCTION
    }
  }),
  fadeInUp: (delay = 0): MotionOptions => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay,
      ease: EASE_FUNCTION
    }
  }),
  fadeInDown: (delay = 0): MotionOptions => ({
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay,
      ease: EASE_FUNCTION
    }
  }),
  scaleIn: (delay = 0): MotionOptions => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.5,
      delay,
      ease: EASE_FUNCTION
    }
  }),
  slideInLeft: (delay = 0): MotionOptions => ({
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: 0.5,
      delay,
      ease: EASE_FUNCTION
    }
  }),
  slideInRight: (delay = 0): MotionOptions => ({
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: 0.5,
      delay,
      ease: EASE_FUNCTION
    }
  })
}

interface AnimatedProps {
  as?: MotionElement
  animation?: MotionOptions
  preset?: keyof typeof animationPresets
  delay?: number
  children: ReactNode
  className?: string
}

function Animated({
  as = 'div',
  animation,
  preset,
  delay = 0,
  children,
  className,
  ...props
}: AnimatedProps & Omit<HTMLMotionProps<any>, keyof AnimatedProps>) {
  const Component = motion[as] as any

  // 如果提供了 preset，使用预设；否则使用 animation
  const motionOptions: MotionOptions = preset
    ? animationPresets[preset](delay)
    : animation || {}

  return (
    <Component className={className} {...motionOptions} {...props}>
      {children}
    </Component>
  )
}

export default Animated
