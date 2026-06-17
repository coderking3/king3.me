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

interface ConfirmSharedProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  className?: string
  size?: 'default' | 'sm'
  children?: React.ReactNode
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

export type ConfirmProps = ConfirmSharedProps &
  (DefaultFooterProps | CustomFooterProps) &
  (ControlledModeProps | TriggerModeProps)

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

export default Confirm
