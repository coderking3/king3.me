// ──── Shared Props ────

interface ModalSharedProps {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
  showFooter?: boolean
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

// ──── Open Mode ────

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

export type { DefaultFooterProps }
