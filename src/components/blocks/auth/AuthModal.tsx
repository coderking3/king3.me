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
  callbackURL
}: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        position="top"
        className="w-full max-w-[400px] rounded-2xl px-8 py-7"
      >
        {/* 无障碍必须有 title/description，视觉上由 AuthForm 内部渲染，这里隐藏 */}
        <DialogHeader className="sr-only">
          <DialogTitle>登录</DialogTitle>
          <DialogDescription>使用第三方账户登录</DialogDescription>
        </DialogHeader>

        <AuthForm
          callbackURL={callbackURL}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
