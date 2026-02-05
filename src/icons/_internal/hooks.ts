'use client'

import type {
  BoopDuration,
  InteractionTrigger,
  InteractiveState
} from './types'

import { isObject } from 'kedash'
import { useMemo, useState } from 'react'

import { useBoop } from '@/hooks'

interface InteractionHandlers {
  onMouseEnter: (e: any) => void
  onMouseLeave: (e: any) => void
  onMouseDown: (e: any) => void
  onMouseUp: (e: any) => void
  onTouchStart: (e: any) => void
  onTouchEnd: (e: any) => void
}

interface UseInteractiveOptions {
  /** 触发 boop 的交互类型 */
  trigger?: InteractionTrigger | InteractionTrigger[]
  /** Boop 持续时间（毫秒）- 可以是统一值或分别设置 */
  duration?: number | BoopDuration
  /** 自定义事件处理器 */
  onHandlers?: Partial<InteractionHandlers>
}

interface UseInteractiveReturn extends InteractiveState {
  /** 交互事件处理器（需展开到元素上） */
  handlers: Required<InteractionHandlers>
}

export function useInteractive({
  trigger = 'hover',
  duration = 150,
  onHandlers = {}
}: UseInteractiveOptions = {}): UseInteractiveReturn {
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // 解析 duration 配置
  const hoverDuration = isObject(duration) ? duration.hover : duration
  const clickDuration = isObject(duration) ? duration.click : duration

  const isHovered = useBoop(isHovering, hoverDuration)
  const isClicked = useBoop(isPressed, clickDuration)

  // 标准化 trigger 为数组
  const triggers = useMemo(
    () => (Array.isArray(trigger) ? trigger : [trigger]),
    [trigger]
  )

  const shouldHandleHover = triggers.includes('hover')
  const shouldHandleClick = triggers.includes('click')

  const handlers = useMemo(
    () => ({
      onMouseEnter: (e: any) => {
        onHandlers.onMouseEnter?.(e)
        if (shouldHandleHover) setIsHovering(true)
      },
      onMouseLeave: (e: any) => {
        onHandlers.onMouseLeave?.(e)
        if (shouldHandleHover) setIsHovering(false)
      },
      onMouseDown: (e: any) => {
        onHandlers.onMouseDown?.(e)
        if (shouldHandleClick) setIsPressed(true)
      },
      onMouseUp: (e: any) => {
        onHandlers.onMouseUp?.(e)
        if (shouldHandleClick) setIsPressed(false)
      },
      onTouchStart: (e: any) => {
        onHandlers.onTouchStart?.(e)
        if (shouldHandleClick) setIsPressed(true)
      },
      onTouchEnd: (e: any) => {
        onHandlers.onTouchEnd?.(e)
        if (shouldHandleClick) setIsPressed(false)
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
