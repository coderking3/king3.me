'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { useInteractive } from '@/icons'
import { ArrowLeftIcon } from '@/icons/ArrowLeft'

import AuthForm from './AuthForm'

function Back() {
  const { t } = useTranslation('auth')
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
      <span className="ml-0.5">{t('back')}</span>
    </Link>
  )
}

function AuthContent() {
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

function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}

export default AuthPage
