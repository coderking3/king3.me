'use client'

import type { ConfirmProps } from './types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui'

export function Confirm({
  title,
  description,
  variant = 'default',
  className,
  size = 'default',
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  ...props
}: ConfirmProps) {
  const content = (
    <AlertDialogContent size={size} className={className}>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
        {children}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
        <AlertDialogAction
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={onConfirm}
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )

  // Trigger mode
  if ('trigger' in props && props.trigger) {
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<span />}>
          {props.trigger}
        </AlertDialogTrigger>
        {content}
      </AlertDialog>
    )
  }

  // Controlled mode
  const { open, onClose } = props as { open: boolean; onClose: () => void }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      {content}
    </AlertDialog>
  )
}
