'use client'

import { LogoIcon, useInteractive } from '@/components/icons'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface LogoProps {
  /**
   * Whether to show the icon
   * - undefined (default): keep the original responsive behavior — visible on desktop, hidden on mobile
   * - true: force show (regardless of breakpoint)
   * - false: force hide (regardless of breakpoint)
   */
  showIcon?: boolean
}

function Logo({ showIcon }: LogoProps) {
  const { isHovered, isClicked, handlers } = useInteractive({
    trigger: ['hover', 'click']
  })

  return (
    <Link
      href="/"
      className="text-accent-foreground/85 hover:text-accent-foreground mx-1 flex items-center transition-colors duration-200 select-none"
      {...handlers}
    >
      <span
        className={cn(
          'relative size-8 min-w-8 items-center justify-center rounded-full outline-offset-2 before:absolute before:-inset-1 before:content-[""]',
          // when showIcon is not provided, keep the default responsive logic
          showIcon === undefined && 'hidden md:inline-flex',
          // when explicitly provided, show/hide directly, ignoring breakpoints
          showIcon === true && 'inline-flex',
          showIcon === false && 'hidden'
        )}
      >
        <LogoIcon size={29} {...{ isHovered, isClicked }}></LogoIcon>
      </span>

      <span className="font-logo ml-[3px] text-xl font-normal">King3</span>
    </Link>
  )
}

export default Logo
