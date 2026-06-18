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

interface ModalSharedProps {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
  showFooter?: boolean
  position?: 'center' | 'top'
  fullscreen?: boolean
}

interface DefaultFooterProps {
  renderFooter?: never
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface CustomFooterProps {
  renderFooter: () => React.ReactNode
  confirmText?: never
  cancelText?: never
  onConfirm?: never
  onCancel?: never
}

interface ControlledModeProps {
  open: boolean
  onClose: () => void
  trigger?: never
}

interface TriggerModeProps {
  open?: never
  onClose?: never
  trigger: React.ReactNode
}

export type ModalProps = ModalSharedProps &
  (DefaultFooterProps | CustomFooterProps) &
  (ControlledModeProps | TriggerModeProps)

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

export default Modal
