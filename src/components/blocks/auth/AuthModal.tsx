'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui'

import AuthForm from './AuthForm'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  callbackURL?: string
}

export default function AuthModal({
  open,
  onOpenChange,
  callbackURL = '/message'
}: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[400px] rounded-2xl px-8 py-7">
        {/* 无障碍必须有 title/description，但视觉上由 AuthForm 内部渲染，这里隐藏 */}
        <DialogHeader className="sr-only">
          <DialogTitle>登录</DialogTitle>
          <DialogDescription>使用邮箱或第三方账户登录</DialogDescription>
        </DialogHeader>

        <AuthForm
          callbackURL={callbackURL}
          onSuccess={() => onOpenChange(false)}
        />

        {/* 底部条款 */}
        <p className="mt-2 text-center text-[11px] leading-relaxed text-gray-400 dark:text-neutral-500">
          继续即表示你同意我们的{' '}
          <a
            href="/terms"
            className="underline underline-offset-2 transition hover:text-gray-600 dark:hover:text-gray-300"
          >
            服务条款
          </a>{' '}
          和{' '}
          <a
            href="/privacy"
            className="underline underline-offset-2 transition hover:text-gray-600 dark:hover:text-gray-300"
          >
            隐私政策
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
