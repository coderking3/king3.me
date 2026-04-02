'use client'

import type { ConfirmProps, DefaultFooterProps } from './types'

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

export function Confirm(props: ConfirmProps) {
  const {
    title,
    description,
    variant = 'default',
    className,
    size = 'default',
    children
  } = props

  /* --- Footer --- */

  const footerContent = (() => {
    if ('renderFooter' in props && props.renderFooter) {
      return <AlertDialogFooter>{props.renderFooter()}</AlertDialogFooter>
    }

    const {
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel
    } = props as DefaultFooterProps

    return (
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
        <AlertDialogAction
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={onConfirm}
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    )
  })()

  /* --- Content --- */

  const content = (
    <AlertDialogContent size={size} className={className}>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>
      {children}
      {footerContent}
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
