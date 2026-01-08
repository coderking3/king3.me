'use client'

import type { SvgIcon } from '@/types'

import Link from 'next/link'
import React from 'react'

import { useBoop } from '@/hooks'
import { cn } from '@/lib/utils'

interface RenderData {
  isHoverBoop?: boolean
  isClickBoop?: boolean
}

type BoopTrigger = 'hover' | 'click'

interface BaseProps {
  alt?: string
  size?: number
  boopOn?: BoopTrigger | BoopTrigger[]
  boopTiming?: number
  children: (data: RenderData) => React.ReactNode
  ref?: React.RefObject<HTMLAnchorElement | HTMLButtonElement | null>
}

type LinkProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    href: string
    prefetch?: boolean
  }

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: never
  }

export type InteractiveProps = LinkProps | ButtonProps

export type IconInteractiveProps<T extends SvgIcon = SvgIcon> =
  | ({
      href: string
    } & T &
      Omit<LinkProps, 'children' | 'href'>)
  | ({
      href?: never
    } & T &
      Omit<ButtonProps, 'children' | 'boopOn'>)

function Interactive({
  ref,
  alt,
  boopOn = 'hover',
  children,
  boopTiming,
  className,
  href,
  ...delegated
}: InteractiveProps) {
  const [isHoverEngaged, setIsHoverEngaged] = React.useState(false)
  const [isClickEngaged, setIsClickEngaged] = React.useState(false)

  const isHoverBoop = useBoop(isHoverEngaged, boopTiming)
  const isClickBoop = useBoop(isClickEngaged, boopTiming)

  const isLink = !!href
  const Component = isLink ? Link : 'button'

  // 将 boopOn 标准化为数组
  const triggers = React.useMemo(
    () => (Array.isArray(boopOn) ? boopOn : [boopOn]),
    [boopOn]
  )

  // 检查是否包含某个触发器
  const hasHover = triggers.includes('hover')
  const hasClick = triggers.includes('click')

  const eventHandlers = {
    onClick: (ev: any) => {
      delegated.onClick?.(ev)
    },
    onMouseEnter: (ev: any) => {
      delegated.onMouseEnter?.(ev)
      if (hasHover) setIsHoverEngaged(true)
    },
    onMouseLeave: (ev: any) => {
      delegated.onMouseLeave?.(ev)
      if (hasHover) setIsHoverEngaged(false)
    },
    onMouseDown: (ev: any) => {
      delegated.onMouseDown?.(ev)
      if (hasClick) setIsClickEngaged(true)
    },
    onMouseUp: (ev: any) => {
      delegated.onMouseUp?.(ev)
      if (hasClick) setIsClickEngaged(false)
    },
    onTouchStart: (ev: any) => {
      delegated.onTouchStart?.(ev)
      if (hasClick) setIsClickEngaged(true)
    },
    onTouchEnd: (ev: any) => {
      delegated.onTouchEnd?.(ev)
      if (hasClick) setIsClickEngaged(false)
    }
  }

  return (
    <Component
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center',
        'size-8 min-w-8',
        'rounded-full outline-offset-2',
        'transition-colors duration-200',
        'text-inherit',
        'hover:text-accent-foreground',
        'before:absolute before:inset-[-4px] before:content-[""]',
        className
      )}
      {...((isLink ? { href } : { type: 'button' }) as any)}
      {...eventHandlers}
      {...delegated}
    >
      {children({ isHoverBoop, isClickBoop })}
      {alt && <span className="sr-only">{alt}</span>}
    </Component>
  )
}

export default Interactive
