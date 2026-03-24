'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import AuthForm from '@/components/blocks/auth/AuthForm'
import { useInteractive } from '@/icons'
import { ArrowLeftIcon } from '@/icons/ArrowLeft'

function Back() {
  const { isHovered, handlers } = useInteractive({
    trigger: ['hover'],
    duration: 180
  })

  return (
    <Link
      href="/"
      className="text-muted-foreground hover:text-foreground/80 absolute top-4 right-4.5 flex items-center transition-colors duration-180"
      {...handlers}
    >
      <ArrowLeftIcon size={18} isHovered={isHovered}></ArrowLeftIcon>
      {/* <ArrowLeft className="size-5" /> */}
      <span className="ml-0.5">Back</span>
    </Link>
  )
}

export default function AuthPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="from-background/70 to-background/90 border-border/70 dark:border-border shadow-muted-foreground/10 relative w-full max-w-sm rounded-2xl border bg-linear-to-b p-8 shadow-2xl backdrop-blur-xs backdrop-saturate-150">
        <Back />
        <AuthForm callbackURL={redirect} />
      </div>
    </div>
  )
}
