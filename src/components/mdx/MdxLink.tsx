'use client'

import { useInteractive } from '@/icons'
import { ExternalLinkIcon } from '@/icons/ExternalLink'

const EXTERNAL_LINK_RE = /^https?:\/\//

function isExternalLink(href?: string) {
  if (!href) return false
  return EXTERNAL_LINK_RE.test(href)
}

export function MdxLink({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { isHovered, handlers } = useInteractive()

  const external = isExternalLink(href)

  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={external ? `group/link ${className ?? ''}` : className}
      {...handlers}
      {...props}
    >
      {children}
      {external && (
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
