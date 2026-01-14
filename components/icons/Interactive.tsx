'use client'

import type {
  BoopDuration,
  InteractionTrigger,
  InteractiveState
} from '@/hooks/useInteractive'
import type { SvgIcon } from '@/types'

import Link from 'next/link'
import React from 'react'

import { useInteractive } from '@/hooks/useInteractive'
import { cn } from '@/lib/utils'

interface BaseProps {
  alt?: string
  size?: number
  trigger?: InteractionTrigger | InteractionTrigger[]
  duration?: number | BoopDuration
  children: (state: InteractiveState) => React.ReactNode
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
      Omit<ButtonProps, 'children' | 'trigger'>)

function Interactive({
  ref,
  alt,
  trigger = 'hover',
  children,
  duration,
  className,
  href,
  ...delegated
}: InteractiveProps) {
  const { isHovered, isClicked, handlers } = useInteractive({
    trigger,
    duration,
    onHandlers: delegated
  })

  const isLink = !!href
  const Component = isLink ? Link : 'button'

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
        'before:absolute before:-inset-1 before:content-[""]',
        className
      )}
      {...((isLink ? { href } : { type: 'button' }) as any)}
      {...handlers}
      {...delegated}
    >
      {children({ isHovered, isClicked })}
      {alt && <span className="sr-only">{alt}</span>}
    </Component>
  )
}

export default Interactive
