'use client'

import type { HTMLMotionProps } from 'framer-motion'
import type { ComponentType, ReactNode } from 'react'

import type { PresetOption } from '@/components/common/Animated/types'
import type { MotionElement, MotionOptions } from '@/types'

import { motion } from 'framer-motion'

import { resolvePreset } from '@/components/common/Animated'
import { usePageEntrance } from '@/hooks/usePageEntrance'

interface HomeAnimatedProps {
  as?: MotionElement
  animation?: MotionOptions
  preset?: PresetOption
  children?: ReactNode
  className?: string
}

function HomeAnimated({
  as = 'div',
  animation,
  preset,
  children,
  className,
  ...props
}: HomeAnimatedProps & Omit<HTMLMotionProps<any>, keyof HomeAnimatedProps>) {
  const Component = motion[as] as ComponentType<any>
  const { entranceKey, shouldAnimateOnMount } = usePageEntrance()
  const motionOptions: MotionOptions = preset
    ? resolvePreset(preset)
    : animation || {}

  return (
    <Component
      key={entranceKey}
      className={className}
      {...motionOptions}
      {...props}
      initial={
        shouldAnimateOnMount ? (props.initial ?? motionOptions.initial) : false
      }
    >
      {children}
    </Component>
  )
}

export default HomeAnimated
