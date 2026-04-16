'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Spinner } from '@/components/ui'
import { GithubCircleIcon, GoogleIcon, MaterialArrowRightIcon } from '@/icons'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

type Provider = 'github' | 'google'

interface AuthFormProps {
  callbackURL?: string
  onSuccess?: () => void
}

function OAuthButton({
  icon,
  label,
  sublabel,
  loading,
  disabled,
  onClick
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group border-border/80 bg-background! hover:bg-muted! dark:hover:bg-muted',
        'relative flex h-14 w-full items-center justify-between overflow-hidden rounded-lg border pr-4 pl-4 transition-colors',
        disabled
          ? 'pointer-events-none cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      )}
    >
      {/* Left: icon + text */}
      <div className={cn('flex items-center gap-3.5', loading && 'opacity-0')}>
        <span className="text-foreground/60 group-hover:text-foreground/80 shrink-0 transition-colors">
          {icon}
        </span>
        <div className="text-left">
          <p className="text-foreground text-[13.5px] leading-tight font-medium">
            {label}
          </p>
          <p className="text-muted-foreground text-[11.5px] leading-tight">
            {sublabel}
          </p>
        </div>
      </div>

      {/* Right */}
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      ) : (
        !disabled && (
          <span className="-translate-x-1.5 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
            <MaterialArrowRightIcon size={18} />
          </span>
        )
      )}
    </button>
  )
}

function AuthForm({ callbackURL = '/', onSuccess }: AuthFormProps) {
  const { t } = useTranslation('auth')
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)
  const anyLoading = loadingProvider !== null

  const handleOAuth = async (provider: Provider) => {
    if (anyLoading) return
    setLoadingProvider(provider)
    try {
      await authClient.signIn.social({
        callbackURL,
        provider
      })

      onSuccess?.()
    } catch (err) {
      console.error('OAuth error:', err)
      toast.error('An error occurred during login.')
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2">
        <div className="bg-foreground relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md">
          <Image
            src="http://i0.hdslb.com/bfs/openplatform/7360364dd1b217628c0b00606eac1dc2b403a5ef.png"
            alt="avatar"
            fill
          />
        </div>
        <span className="text-foreground text-sm font-semibold tracking-tight">
          king3.me
        </span>
      </div>

      {/* Title */}
      <div className="mb-7">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          {t('welcomeBack')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('signInSubtitle')}
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-2.5">
        <OAuthButton
          icon={<GithubCircleIcon size={20} />}
          label={t('continueWithGithub')}
          sublabel="github.com"
          loading={loadingProvider === 'github'}
          disabled={anyLoading && loadingProvider !== 'github'}
          onClick={() => handleOAuth('github')}
        />
        <OAuthButton
          icon={<GoogleIcon size={20} />}
          label={t('continueWithGoogle')}
          sublabel="google.com"
          loading={loadingProvider === 'google'}
          disabled={anyLoading && loadingProvider !== 'google'}
          onClick={() => handleOAuth('google')}
        />
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-[10.5px] font-medium tracking-[0.15em] uppercase">
          {t('secureLogin')}
        </span>
        <div className="bg-border h-px flex-1" />
      </div>

      {/* Security notice */}
      <div className="bg-muted/40 border-border/40 flex items-center justify-center gap-2 rounded-lg border px-4 py-2">
        <svg
          className="text-muted-foreground/70 size-3.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-muted-foreground/70 text-[12px]">
          {t('oauthNotice')}
        </p>
      </div>
    </div>
  )
}

export default AuthForm
