'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'

import {
  Button,
  Field,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupInput,
  Spinner
} from '@/components/ui'
import { GithubCircleIcon, GoogleIcon } from '@/icons'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = 'sign-in' | 'sign-up'
type SignInStep = 'email' | 'password'
type SignUpStep = 'info' | 'otp'

interface AuthFormProps {
  onSuccess?: () => void
  defaultMode?: Mode
}

// ─── Animation variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 }
}

// ─── OTP Input (6-digit Clerk style) ─────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  disabled
}: {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.padEnd(6, '').split('').slice(0, 6)

  const handleChange = (idx: number, char: string) => {
    const cleaned = char.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, i) => (i === idx ? cleaned : d)).join('')
    onChange(next)
    if (cleaned && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
      const next = digits.map((d, i) => (i === idx - 1 ? '' : d)).join('')
      onChange(next)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    onChange(pasted.padEnd(6, '').slice(0, 6))
    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digits[idx] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'border-border bg-background text-foreground h-12 w-full rounded-xl border text-center text-lg font-semibold',
            'focus:border-primary focus:ring-primary/20 transition-all outline-none focus:ring-2',
            'disabled:opacity-50',
            digits[idx] && 'border-primary/60'
          )}
        />
      ))}
    </div>
  )
}

// ─── SocialButton ─────────────────────────────────────────────────────────────
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
          <span className="-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
            <MaterialArrowRight size={20} />
          </span>
        )
      )}
    </button>
  )
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export function AuthFormNew({
  onSuccess,
  defaultMode = 'sign-in'
}: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const isSignIn = mode === 'sign-in'

  // Sign-in state
  const [signInStep, setSignInStep] = useState<SignInStep>('email')
  // Sign-up state
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('info')

  // Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const reset = () => {
    setSignInStep('email')
    setSignUpStep('info')
    setEmail('')
    setPassword('')
    setName('')
    setOtp('')
    setError(null)
    setLoading(false)
  }

  const handleSwitchMode = () => {
    reset()
    setMode(isSignIn ? 'sign-up' : 'sign-in')
  }

  // 倒计时
  const startCooldown = (seconds = 60) => {
    setResendCooldown(seconds)
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // ── Sign-in: Step 1 - 检查用户是否存在 ──────────────────────────────────────
  const handleCheckEmail = async () => {
    if (!email) return
    setLoading(true)
    setError(null)
    try {
      // 调用你自己的 Next.js API 路由检查用户是否存在
      // 示例: app/api/auth/check-email/route.ts (见文末)
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.exists) {
        setSignInStep('password')
      } else {
        setError('No account found with this email. Try signing up.')
      }
    } catch {
      setError('Something went wrong, please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign-in: Step 2 - 密码登录 ──────────────────────────────────────────────
  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/'
      })
      if (error) throw new Error(error.message)
      onSuccess?.()
    } catch (e: any) {
      setError(e.message ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign-up: Step 1 - 注册并发送验证码 ─────────────────────────────────────
  const handleSignUp = async () => {
    if (!email || !name || !password) return
    setLoading(true)
    setError(null)
    try {
      // 1. 注册账号
      const { error: signUpError } = await authClient.signUp.email({
        email,
        name,
        password,
        callbackURL: '/'
      })
      if (signUpError) throw new Error(signUpError.message)

      // 2. 发送 OTP 邮件验证码
      const { error: otpError } = await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: 'email-verification'
        }
      )
      if (otpError) throw new Error(otpError.message)

      setSignUpStep('otp')
      startCooldown(60)
    } catch (e: any) {
      setError(e.message ?? 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign-up: Step 2 - 验证 OTP ──────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await authClient.emailOtp.verifyEmail({ email, otp })
      if (error) throw new Error(error.message)
      onSuccess?.()
    } catch (e: any) {
      setError(e.message ?? 'Invalid or expired code.')
      if (
        e.message?.includes('TOO_MANY_ATTEMPTS') ||
        e.message?.includes('OTP_EXPIRED')
      ) {
        setOtp('')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification'
      })
      if (error) throw new Error(error.message)
      setOtp('')
      startCooldown(60)
    } catch (e: any) {
      setError(e.message ?? 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = (provider: 'github' | 'google') => {
    authClient.signIn.social({ provider, callbackURL: '/' })
  }

  // ── 根据当前步骤渲染不同内容 ──────────────────────────────────────────────────
  const renderFormContent = () => {
    // ── Sign-in: OTP 验证步骤 ──────────────────────────────────────────────────
    if (isSignIn && signInStep === 'password') {
      return (
        <motion.div
          key="signin-password"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          {/* 邮箱回显（不可编辑） */}
          <div className="border-border/80 bg-muted/40 flex items-center justify-between rounded-xl border px-4 py-2.5">
            <span className="text-foreground/80 text-sm">{email}</span>
            <button
              type="button"
              onClick={() => {
                setSignInStep('email')
                setError(null)
                setPassword('')
              }}
              className="text-muted-foreground hover:text-foreground text-xs underline transition-colors"
            >
              Change
            </button>
          </div>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>Password</FieldLabel>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground text-[13px] underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <InputGroup>
              <InputGroupInput>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                />
              </InputGroupInput>
            </InputGroup>
          </Field>

          {error && <ErrorMessage message={error} />}

          <Button
            type="button"
            onClick={handleSignIn}
            disabled={loading || !password}
            className="h-10.5 w-full rounded-xl font-medium"
          >
            {loading ? <Spinner /> : 'Sign In'}
          </Button>
        </motion.div>
      )
    }

    // ── Sign-up: OTP 验证步骤 ─────────────────────────────────────────────────
    if (!isSignIn && signUpStep === 'otp') {
      return (
        <motion.div
          key="signup-otp"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-5"
        >
          <div className="text-center">
            <p className="text-foreground text-sm font-medium">
              Check your email
            </p>
            <p className="text-muted-foreground mt-1 text-[13px]">
              We sent a 6-digit code to{' '}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          <OtpInput value={otp} onChange={setOtp} disabled={loading} />

          {error && <ErrorMessage message={error} />}

          <Button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className="h-10.5 w-full rounded-xl font-medium"
          >
            {loading ? <Spinner /> : 'Verify Email'}
          </Button>

          <p className="text-center text-[13px]">
            <span className="text-muted-foreground">
              Didn't receive a code?{' '}
            </span>
            {resendCooldown > 0 ? (
              <span className="text-muted-foreground">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-foreground cursor-pointer underline"
              >
                Resend
              </button>
            )}
          </p>
        </motion.div>
      )
    }

    // ── Sign-in: 邮箱步骤 ─────────────────────────────────────────────────────
    if (isSignIn) {
      return (
        <motion.div
          key="signin-email"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel>Email address</FieldLabel>
            <InputGroup>
              <InputGroupInput>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckEmail()}
                />
              </InputGroupInput>
            </InputGroup>
          </Field>

          {error && <ErrorMessage message={error} />}

          <Button
            type="button"
            onClick={handleCheckEmail}
            disabled={loading || !email}
            className="h-10.5 w-full rounded-xl font-medium"
          >
            {loading ? <Spinner /> : 'Continue'}
          </Button>
        </motion.div>
      )
    }

    // ── Sign-up: 填写信息步骤 ──────────────────────────────────────────────────
    return (
      <motion.div
        key="signup-info"
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col gap-4"
      >
        <Field>
          <FieldLabel>Name</FieldLabel>
          <InputGroup>
            <InputGroupInput>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </InputGroupInput>
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel>Email address</FieldLabel>
          <InputGroup>
            <InputGroupInput>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </InputGroupInput>
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <InputGroup>
            <InputGroupInput>
              <Input
                type="password"
                placeholder="Create a password (8+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </InputGroupInput>
          </InputGroup>
        </Field>

        {error && <ErrorMessage message={error} />}

        <Button
          type="button"
          onClick={handleSignUp}
          disabled={loading || !email || !name || password.length < 8}
          className="h-10.5 w-full rounded-xl font-medium"
        >
          {loading ? <Spinner /> : 'Continue'}
        </Button>
      </motion.div>
    )
  }

  // 隐藏 OTP 步骤时的 social 区域
  const showSocial = isSignIn ? signInStep === 'email' : signUpStep === 'info'

  const labels = {
    title: isSignIn ? 'Sign In' : 'Sign Up',
    subTitle: isSignIn ? 'Continue using king3.me' : 'Create your account',
    prompt: isSignIn
      ? "Don't have an account yet?"
      : 'Already have an account?',
    action: isSignIn ? 'Sign up' : 'Sign in'
  }

  // OTP 步骤时隐藏 title 区域（可选）
  const isOtpStep = !isSignIn && signUpStep === 'otp'

  return (
    <div className="w-full">
      {/* Title */}
      <AnimatePresence mode="wait">
        {!isOtpStep && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <h1 className="text-primary text-xl font-semibold tracking-tight">
              {labels.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              {labels.subTitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social (only on first step) */}
      <AnimatePresence>
        {showSocial && (
          <motion.div
            key="social"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <SocialButton
                icon={<GithubCircleIcon size={18} />}
                label="Continue using GitHub"
                loading={false}
                disabled={loading}
                onClick={() => handleSocial('github')}
              />
              <SocialButton
                icon={<GoogleIcon size={18} />}
                label="Continue using Google"
                loading={false}
                disabled={loading}
                onClick={() => handleSocial('google')}
              />
            </div>
            <div className="my-8 flex items-center gap-3">
              <div className="dark:bg-muted-foreground/30 bg-muted-foreground/20 h-px flex-1" />
              <span className="text-muted-foreground text-[13px] font-medium tracking-wider">
                or
              </span>
              <div className="dark:bg-muted-foreground/30 bg-muted-foreground/20 h-px flex-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content */}
      <AnimatePresence mode="wait">{renderFormContent()}</AnimatePresence>

      {/* Mode Switch (OTP 步骤时隐藏) */}
      {!isOtpStep && (
        <p className="text-muted-foreground mt-6 text-[13px]">
          <span className="mr-1.5 inline-block">{labels.prompt}</span>
          <span
            className="text-foreground cursor-pointer underline"
            onClick={handleSwitchMode}
          >
            {labels.action}
          </span>
        </p>
      )}
    </div>
  )
}

// ─── Error Message ────────────────────────────────────────────────────────────
function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-[13px]"
    >
      {message}
    </motion.p>
  )
}

// ─── Arrow Icon ───────────────────────────────────────────────────────────────
export function MaterialArrowRight({ size = 20, color = 'currentColor' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
    >
      <path
        fill={color}
        d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"
      />
    </svg>
  )
}
