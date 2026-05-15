'use client'

import * as React from 'react'

import { useInteractive } from '@/components/icons'
import { ExternalLinkIcon } from '@/components/icons/ExternalLink'
import { cn } from '@/lib/utils'

const EXTERNAL_LINK_RE = /^https?:\/\//

function isExternalLink(href?: string) {
  if (!href) return false
  return EXTERNAL_LINK_RE.test(href)
}

function MdxLink({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { isHovered, handlers } = useInteractive()

  const isExternal = isExternalLink(href)
  const isHeading = className?.includes('anchor')
  const isChildCode = React.isValidElement(children) && children.type === 'code'
  const showExternal = isExternal && !isHeading && !isChildCode

  return (
    <a
      href={href}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      className={cn(className, isExternal && `group/link external`)}
      {...handlers}
      {...props}
    >
      {children}
      {showExternal && (
        <ExternalLinkIcon
          size={12}
          isHovered={isHovered}
          colors={{
            arrow: 'var(--mdx-link-arrow)',
            body: 'currentColor'
          }}
          className="ml-0.5 inline-block overflow-visible align-baseline transition-[--mdx-link-arrow] duration-200 [--mdx-link-arrow:currentColor] group-hover/link:[--mdx-link-arrow:var(--color-brand)]"
        />
      )}
    </a>
  )
}

export default MdxLink
