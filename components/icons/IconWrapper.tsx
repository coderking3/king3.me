'use client'

import Link from 'next/link'
import React from 'react'

import { useBoopMinimal } from '@/hooks'
import { cn } from '@/lib/utils'

interface RenderData {
  isBooped: boolean
}

type ChildlessAnchor = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
>

interface Props extends ChildlessAnchor {
  alt?: string
  size?: number
  boopOn?: 'hover' | 'click'
  prefetch?: boolean
  href?: string
  boopTiming?: number
  children: (data: RenderData) => React.ReactNode
}

export function IconWrapper({
  ref,
  alt,
  boopOn = 'hover',
  children,
  boopTiming,
  className,
  href,
  ...delegated
}: Props & { ref?: React.RefObject<HTMLAnchorElement | null> }) {
  const [isEngaged, setIsEngaged] = React.useState(false)
  const isBooped = useBoopMinimal(isEngaged, boopTiming)

  const isLink = !!href

  const commonProps = {
    ref,
    className: cn(
      // 基础样式
      'relative inline-flex items-center justify-center',
      'size-8 min-w-8',
      'rounded-full outline-offset-2',
      'transition-colors duration-200',
      // 继承颜色
      'text-inherit',
      // hover 状态
      'hover:text-accent-foreground',
      // 增加点击区域 (通过 before 伪元素)
      'before:content-[""] before:absolute before:inset-[-4px]',
      className
    ),
    onClick: (ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      delegated.onClick?.(ev as React.MouseEvent<HTMLAnchorElement>)
    },
    onMouseEnter: (
      ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
    ) => {
      delegated.onMouseEnter?.(ev as React.MouseEvent<HTMLAnchorElement>)

      if (boopOn === 'hover') {
        setIsEngaged(true)
      }
    },
    onMouseLeave: (
      ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
    ) => {
      delegated.onMouseLeave?.(ev as React.MouseEvent<HTMLAnchorElement>)
      setIsEngaged(false)
    },
    onMouseDown: (
      ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
    ) => {
      delegated.onMouseDown?.(ev as React.MouseEvent<HTMLAnchorElement>)

      if (boopOn === 'click') {
        setIsEngaged(true)
      }
    },
    onMouseUp: (
      ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
    ) => {
      delegated.onMouseUp?.(ev as React.MouseEvent<HTMLAnchorElement>)

      if (boopOn === 'click') {
        setIsEngaged(false)
      }
    },
    onTouchStart: (
      ev: React.TouchEvent<HTMLAnchorElement | HTMLButtonElement>
    ) => {
      delegated.onTouchStart?.(ev as React.TouchEvent<HTMLAnchorElement>)

      if (boopOn === 'click') {
        setIsEngaged(true)
      }
    },
    onTouchEnd: (
      ev: React.TouchEvent<HTMLAnchorElement | HTMLButtonElement>
    ) => {
      delegated.onTouchEnd?.(ev as React.TouchEvent<HTMLAnchorElement>)

      if (boopOn === 'click') {
        setIsEngaged(false)
      }
    }
  }

  const content = (
    <>
      {children({ isBooped })}
      {alt && (
        <span className="sr-only absolute h-px w-px overflow-hidden border-0 p-0">
          {alt}
        </span>
      )}
    </>
  )

  if (isLink && href) {
    return (
      <Link href={href} {...commonProps} {...delegated}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" {...commonProps} {...(delegated as any)}>
      {content}
    </button>
  )
}
