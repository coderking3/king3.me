'use client'

import { useTranslations } from 'next-intl'

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
  const t = useTranslations('page.auth')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        position="top"
        className="w-full max-w-[400px] rounded-xl px-8 py-7"
      >
        {/* Visually hidden for accessibility; AuthForm renders its own heading */}
        <DialogHeader className="sr-only">
          <DialogTitle>{t('signIn')}</DialogTitle>
          <DialogDescription>{t('signInDescription')}</DialogDescription>
        </DialogHeader>

        <AuthForm
          callbackURL={callbackURL}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
