'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import {
  Button,
  Field,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui'
import { GithubCircleIcon, GoogleIcon } from '@/icons'
import { signIn, signUp } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'sign-in' | 'sign-up'
type SocialProvider = 'google' | 'github'
type EmailStep = 'email' | 'password'

interface AuthFormProps {
  /** 登录/注册成功后跳转地址 */
  callbackURL?: string
  /** 成功回调（弹窗场景用） */
  onSuccess?: () => void
  /** 初始模式 */
  defaultMode?: Mode
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuthForm({
  callbackURL = '/message',
  onSuccess,
  defaultMode = 'sign-in'
}: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [emailStep, setEmailStep] = useState<EmailStep>('email')

  // form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // loading states
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
    null
  )
  const [emailLoading, setEmailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSignUp = mode === 'sign-up'

  // ── 切换模式时重置状态 ──────────────────────────────────────────────────────
  const switchMode = (next: Mode) => {
    setMode(next)
    setEmailStep('email')
    setError(null)
    setPassword('')
    setName('')
  }

  // ── Social 登录 ─────────────────────────────────────────────────────────────
  const handleSocialSignIn = async (provider: SocialProvider) => {
    setSocialLoading(provider)
    setError(null)
    await signIn.social({
      provider,
      callbackURL,
      errorCallbackURL: `${callbackURL}?error=auth_failed`
    })
    // social 会自动 redirect，不会走到这里
  }

  // ── 邮箱：第一步提交（填完邮箱 → 进入密码步骤）─────────────────────────────
  const handleEmailStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setEmailStep('password')
  }

  // ── 邮箱：第二步提交（密码 → 登录/注册）────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setEmailLoading(true)

    try {
      if (isSignUp) {
        const res = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0],
          callbackURL
        })
        if (res.error) throw new Error(res.error.message)
        onSuccess?.()
      } else {
        const res = await signIn.email({
          email,
          password,
          callbackURL
        })
        if (res.error) throw new Error(res.error.message)
        onSuccess?.()
      }
    } catch (err) {
      setError(
        err instanceof Error ? friendlyError(err.message) : '出现错误，请重试'
      )
    } finally {
      setEmailLoading(false)
    }
  }

  const anyLoading = socialLoading !== null || emailLoading

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="mb-6 text-center">
        <h2 className="text-[22px] font-semibold tracking-tight text-gray-900 dark:text-white">
          {isSignUp ? 'Sign up' : 'Sign in'}
        </h2>
        <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
          {isSignUp ? `已有账户？` : `还没有账户？`}{' '}
          <button
            type="button"
            onClick={() => switchMode(isSignUp ? 'sign-in' : 'sign-up')}
            className="font-medium text-gray-900 underline underline-offset-2 transition hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
          >
            {isSignUp ? '立即登录' : '免费注册'}
          </button>
        </p>
      </div>

      {/* ── Social Buttons ── */}
      <div className="flex flex-col gap-2.5">
        <SocialButton
          icon={<GoogleIcon size={20} />}
          label="使用 Google 继续"
          loading={socialLoading === 'google'}
          disabled={anyLoading}
          onClick={() => handleSocialSignIn('google')}
        />
        <SocialButton
          icon={<GithubCircleIcon size={18} />}
          label="使用 GitHub 继续"
          loading={socialLoading === 'github'}
          disabled={anyLoading}
          onClick={() => handleSocialSignIn('github')}
        />
      </div>

      {/* ── Divider ── */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
        <span className="text-[11px] font-medium tracking-wider text-gray-400 uppercase dark:text-neutral-500">
          或
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
      </div>

      {/* ── Email Form ── */}
      {emailStep === 'email' ? (
        // Step 1: 输入邮箱
        <form onSubmit={handleEmailStep} className="space-y-3">
          <Field>
            <FieldLabel>邮箱地址</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              autoComplete="email"
              autoFocus
              disabled={anyLoading}
              className={inputCls}
            />
          </Field>
          <SubmitButton disabled={anyLoading || !email.trim()} loading={false}>
            继续
          </SubmitButton>
        </form>
      ) : (
        // Step 2: 输入密码（+ 名字，注册时）
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 邮箱回显 + 返回按钮 */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <span className="text-[13px] text-gray-700 dark:text-gray-300">
              {email}
            </span>
            <button
              type="button"
              onClick={() => {
                setEmailStep('email')
                setError(null)
              }}
              className="text-[12px] text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
            >
              修改
            </button>
          </div>
          {/* 注册时额外需要名字 */}
          {isSignUp && (
            <Field>
              <FieldLabel>{'Your name'}</FieldLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="king3"
                autoComplete="name"
                autoFocus
                disabled={anyLoading}
                className={inputCls}
              />
            </Field>
          )}

          {/* 密码 */}
          <Field>
            <FieldLabel htmlFor="input-group-url">
              {isSignUp ? 'Set password' : 'Password'}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isSignUp
                    ? 'At least 8 characters'
                    : 'Please enter your password'
                }
                required
                minLength={isSignUp ? 8 : 1}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                autoFocus={!isSignUp}
                disabled={anyLoading}
                className={cn(inputCls, 'pr-10')}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          {/* 忘记密码（仅登录模式） */}
          {!isSignUp && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[12px] text-gray-500 transition hover:text-gray-900 dark:hover:text-white"
              >
                忘记密码？
              </button>
            </div>
          )}
          {/* 错误信息 */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          <SubmitButton
            disabled={anyLoading || !password}
            loading={emailLoading}
          >
            {isSignUp ? '创建账户' : '登录'}
          </SubmitButton>
        </form>
      )}
    </div>
  )
}

export { AuthForm as AuthFormOld }

// ─── Sub-components ───────────────────────────────────────────────────────────

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
        'relative flex h-[38px] w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-700 shadow-xs transition',
        'hover:bg-gray-50 hover:shadow-sm',
        'focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
      )}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  )
}

function SubmitButton({
  children,
  disabled,
  loading
}: {
  children: React.ReactNode
  disabled: boolean
  loading: boolean
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        'mt-1 flex h-[38px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 text-[13px] font-medium text-white shadow-xs transition',
        'hover:bg-gray-700',
        'focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
      )}
    >
      {loading ? <Spinner white /> : children}
    </button>
  )
}

function Spinner({ white }: { white?: boolean }) {
  return (
    <svg
      className={cn(
        'h-4 w-4 animate-spin',
        white ? 'text-white' : 'text-gray-600'
      )}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = [
  'w-full h-[38px] rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder:text-gray-400',
  'outline-none transition',
  'focus:border-gray-400 focus:ring-2 focus:ring-gray-200',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500',
  'dark:focus:border-neutral-500 dark:focus:ring-neutral-700'
].join(' ')

function friendlyError(msg: string): string {
  if (msg.includes('Invalid email') || msg.includes('invalid_email'))
    return '邮箱格式不正确'
  if (msg.includes('password') && msg.includes('short'))
    return '密码至少需要 8 位'
  if (msg.includes('already') || msg.includes('exist'))
    return '该邮箱已被注册，请直接登录'
  if (
    msg.includes('Invalid credentials') ||
    msg.includes('invalid_credentials')
  )
    return '邮箱或密码错误'
  if (msg.includes('User not found')) return '该邮箱尚未注册'
  return '出现错误，请重试'
}
