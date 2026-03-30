/* --- Shared --- */

interface ConfirmSharedProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  className?: string
  size?: 'default' | 'sm'
  children?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
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
  (ControlledModeProps | TriggerModeProps)
