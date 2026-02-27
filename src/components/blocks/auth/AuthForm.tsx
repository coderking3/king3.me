'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

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

// ─── Icons ───────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

// king3.wm@gmail.com

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
          {isSignUp ? '创建账户' : '欢迎回来'}
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
          icon={<GoogleIcon />}
          label="使用 Google 继续"
          loading={socialLoading === 'google'}
          disabled={anyLoading}
          onClick={() => handleSocialSignIn('google')}
        />
        <SocialButton
          icon={<GitHubIcon />}
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
          <Field label="邮箱地址">
            <input
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
            <Field label="你的名字">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="张三"
                autoComplete="name"
                autoFocus
                disabled={anyLoading}
                className={inputCls}
              />
            </Field>
          )}

          {/* 密码 */}
          <Field label={isSignUp ? '设置密码' : '密码'}>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? '至少 8 位' : '请输入密码'}
                required
                minLength={isSignUp ? 8 : 1}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                autoFocus={!isSignUp}
                disabled={anyLoading}
                className={cn(inputCls, 'pr-10')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
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

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
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
