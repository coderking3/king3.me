'use client'

import { LogoIcon, useInteractive } from '@/components/icons'
import { Link } from '@/i18n/navigation'

function Logo() {
  const { isHovered, isClicked, handlers } = useInteractive({
    trigger: ['hover', 'click']
  })

  return (
    <Link
      href="/"
      className="text-accent-foreground/85 hover:text-accent-foreground mx-1 flex items-center transition-colors duration-200 select-none"
      {...handlers}
    >
      <span className='relative hidden size-8 min-w-8 items-center justify-center rounded-full outline-offset-2 before:absolute before:-inset-1 before:content-[""] md:inline-flex'>
        <LogoIcon size={29} {...{ isHovered, isClicked }}></LogoIcon>
      </span>

      <span className="font-logo ml-[3px] text-xl font-normal">King3</span>
    </Link>
  )
}

export default Logo
