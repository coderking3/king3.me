import { useState } from 'react'

import { Spinner } from '@/components/ui'
import { GithubCircleIcon, GoogleIcon, MaterialArrowRightIcon } from '@/icons'
import { cn } from '@/lib/utils'

type Mode = 'sign-in' | 'sign-up'
interface AuthFormProps {
  /** 成功回调（弹窗场景用） */
  onSuccess?: () => void
  /** 初始模式 */
  defaultMode?: Mode
}

function SocialButton({
  icon,
  label,
  loading,
  disabled,
  onClick
}: {
  icon: React.ReactNode
  label: string
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
        'group text-foreground bg-background! hover:bg-muted! dark:hover:bg-muted border-border/80',
        'flex h-10.5 w-full items-center justify-between rounded-xl border pr-3.5 pl-5 transition-colors',
        disabled
          ? 'hover:bg-background! dark:hover:bg-background! pointer-events-none cursor-not-allowed opacity-70'
          : 'cursor-pointer'
      )}
    >
      <div
        className={cn('flex items-center', disabled && 'text-muted-foreground')}
      >
        <span className={cn('shrink-0', disabled && 'opacity-60')}>{icon}</span>
        <span className="ml-2">{label}</span>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        !disabled && (
          <span
            className={cn(
              '-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100'
            )}
          >
            <MaterialArrowRightIcon size={20} />
          </span>
        )
      )}
    </button>
  )
}

export function AuthFormNew({
  onSuccess,
  defaultMode = 'sign-in'
}: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const isSignIn = mode === 'sign-in'

  const labels = {
    title: isSignIn ? 'Sign In' : 'Sign Up',
    subTitle: isSignIn ? 'Continue using king3.me' : 'Create your account',
    prompt: isSignIn
      ? "Don't have an account yet?"
      : 'Already have an account?',
    action: isSignIn ? 'Sign in' : 'Sign up'
  }

  const handleSubmit = () => {}

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-primary text-xl font-semibold tracking-tight">
          {labels.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          {labels.subTitle}
        </p>
      </div>

      {/* Social */}
      <div className="flex flex-col gap-2">
        <SocialButton
          icon={<GithubCircleIcon size={18} />}
          label="Continue using GitHub"
          loading={false}
          disabled={false}
          onClick={() => {}}
        />
        <SocialButton
          icon={<GoogleIcon size={18} />}
          label="Continue using Google"
          loading={false}
          disabled={false}
          onClick={() => {}}
        />
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center gap-3">
        <div className="dark:bg-muted-foreground/30 bg-muted-foreground/20 h-px flex-1" />
        <span className="text-muted-foreground text-[13px] font-medium tracking-wider">
          or
        </span>
        <div className="dark:bg-muted-foreground/30 bg-muted-foreground/20 h-px flex-1" />
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4"></form>

      {/* Action */}
      <p className="text-muted-foreground text-[13px]">
        <span className="mr-1.5 inline-block">{labels.prompt}</span>
        <span
          className="text-foreground cursor-pointer underline"
          onClick={() => setMode(isSignIn ? 'sign-up' : 'sign-in')}
        >
          {labels.action}
        </span>
      </p>
    </div>
  )
}
