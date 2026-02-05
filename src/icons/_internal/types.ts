export type InteractionTrigger = 'hover' | 'click'

export interface BoopDuration {
  hover?: number
  click?: number
}

export interface InteractiveState {
  /** Hover 时是否处于 booped 状态 */
  isHovered: boolean
  /** Click 时是否处于 booped 状态 */
  isClicked: boolean
}

export interface SvgIcon {
  /** 大小 */
  size?: number
  /** 颜色 */
  color?: string
  /** 线条宽度 */
  strokeWidth?: number
  /** 线条宽度 */
  style?: React.CSSProperties
}
