/* --- Shared --- */

interface ConfirmSharedProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  className?: string
  size?: 'default' | 'sm'
  children?: React.ReactNode
}

/* --- Footer --- */

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

/* --- Open mode --- */

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

/* --- Exports --- */

export type ConfirmProps = ConfirmSharedProps &
  (DefaultFooterProps | CustomFooterProps) &
  (ControlledModeProps | TriggerModeProps)

export type { DefaultFooterProps }
