'use client'

import Link from 'next/link'

import { LogoIcon, useInteractive } from '@/icons'

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
      <span className='relative inline-flex size-8 min-w-8 items-center justify-center rounded-full outline-offset-2 before:absolute before:-inset-1 before:content-[""]'>
        <LogoIcon
          size={30}
          {...{ isHovered, isClicked }}
          variant="bold"
        ></LogoIcon>
      </span>

      <span className="font-logo ml-1 text-xl font-normal">King3</span>
    </Link>
  )
}

export default Logo
