export type InteractionTrigger = 'hover' | 'click'

export interface InteractiveState {
  isHovered: boolean
  isClicked: boolean
}

export interface SvgIcon {
  size?: number
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
}
