'use client'

import type { InteractionTrigger, InteractiveState } from './types'

import { useMemo, useState } from 'react'

import { useBoop } from '@/hooks'

interface InteractionHandlers {
  onMouseEnter: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

interface UseInteractiveOptions {
  trigger?: InteractionTrigger | InteractionTrigger[]
  duration?: number
  onHandlers?: Partial<InteractionHandlers>
}

interface UseInteractiveReturn extends InteractiveState {
  handlers: Required<InteractionHandlers>
}

export function useInteractive({
  trigger = 'hover',
  duration = 150,
  onHandlers = {}
}: UseInteractiveOptions = {}): UseInteractiveReturn {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const isHovered = useBoop(isHovering, duration)

  const triggers = useMemo(
    () => (Array.isArray(trigger) ? trigger : [trigger]),
    [trigger]
  )

  const shouldHandleHover = triggers.includes('hover')
  const shouldHandleClick = triggers.includes('click')

  const handlers = useMemo<InteractionHandlers>(
    () => ({
      onMouseEnter: (e) => {
        onHandlers.onMouseEnter?.(e)
        if (shouldHandleHover) setIsHovering(true)
      },
      onMouseLeave: (e) => {
        onHandlers.onMouseLeave?.(e)
        if (shouldHandleHover) setIsHovering(false)
      },
      onMouseDown: (e) => {
        onHandlers.onMouseDown?.(e)
        if (shouldHandleClick) setIsClicked(true)
      },
      onMouseUp: (e) => {
        onHandlers.onMouseUp?.(e)
        if (shouldHandleClick) setIsClicked(false)
      },
      onTouchStart: (e) => {
        onHandlers.onTouchStart?.(e)
        if (shouldHandleClick) setIsClicked(true)
      },
      onTouchEnd: (e) => {
        onHandlers.onTouchEnd?.(e)
        if (shouldHandleClick) setIsClicked(false)
      }
    }),
    [onHandlers, shouldHandleHover, shouldHandleClick]
  )

  return {
    isHovered,
    isClicked,
    handlers
  }
}
