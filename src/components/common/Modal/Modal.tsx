'use client'

import type { DefaultFooterProps, ModalProps } from './types'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui'

export function Modal(props: ModalProps) {
  const {
    title,
    description,
    className = 'sm:max-w-md',
    position = 'top',
    fullscreen = false,
    children,
    renderFooter,
    showFooter = true
  } = props

  /* --- Footer --- */

  const footerContent = (() => {
    if (!showFooter) return null
    if (renderFooter) return renderFooter()

    const {
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel
    } = props as DefaultFooterProps

    return (
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />} onClick={onCancel}>
          {cancelText}
        </DialogClose>
        <Button onClick={onConfirm}>{confirmText}</Button>
      </DialogFooter>
    )
  })()

  /* --- Content --- */

  const content = (
    <DialogContent
      position={position}
      fullscreen={fullscreen}
      className={className}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      {children}
      {footerContent}
    </DialogContent>
  )

  /* --- Render --- */

  // Trigger mode
  if ('trigger' in props && props.trigger) {
    return (
      <Dialog>
        <DialogTrigger render={<span />}>{props.trigger}</DialogTrigger>
        {content}
      </Dialog>
    )
  }

  // Controlled mode
  const { open, onClose } = props as { open: boolean; onClose: () => void }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      {content}
    </Dialog>
  )
}
