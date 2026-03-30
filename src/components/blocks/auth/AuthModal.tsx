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
        className="w-full max-w-[400px] rounded-xl px-8 py-7"
      >
        {/* Visually hidden for accessibility; AuthForm renders its own heading */}
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Sign in with a third-party account
          </DialogDescription>
        </DialogHeader>

        <AuthForm
          callbackURL={callbackURL}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
