'use client'

import type { HTMLMotionProps } from 'framer-motion'
import type { ComponentType, ReactNode } from 'react'

import type { PresetOption } from './types'

import type { MotionElement, MotionOptions } from '@/types'

import { motion } from 'framer-motion'

import { resolvePreset } from './presets'

interface AnimatedProps {
  as?: MotionElement
  animation?: MotionOptions
  preset?: PresetOption
  children: ReactNode
  className?: string
}

function Animated({
  as = 'div',
  animation,
  preset,
  children,
  className,
  ...props
}: AnimatedProps & Omit<HTMLMotionProps<any>, keyof AnimatedProps>) {
  const Component = motion[as] as ComponentType<any>

  const motionOptions: MotionOptions = preset
    ? resolvePreset(preset)
    : animation || {}

  return (
    <Component className={className} {...motionOptions} {...props}>
      {children}
    </Component>
  )
}

export default Animated
