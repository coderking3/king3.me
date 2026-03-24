import '@tanstack/react-table'

// ── TanStack meta 类型扩展 ───────────────────────────────────
declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string
    headClassName?: string
    cellClassName?: string
  }
}

// ── ColumnConfig ─────────────────────────────────────────────
export interface ColumnConfig<T> {
  key: string
  title: string
  className?: string
  headClassName?: string
  cellClassName?: string
  /** 是否允许排序，默认 false */
  sortable?: boolean
  /**
   * 是否允许在列显示面板中切换，默认 true
   * actions 列之类的建议设为 false
   */
  enableHiding?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

// ── searchable 配置 ───────────────────────────────────────────
export interface SearchableConfig {
  /** Input placeholder */
  placeholder?: string
  /** 过滤作用的字段 key，默认取第一个非 actions 列 */
  filterKey?: string
}

// ── pagination 配置 ───────────────────────────────────────────
export interface PaginationConfig {
  pageSize?: number
}

// ── DataTableProps ────────────────────────────────────────────────
export interface DataTableProps<T extends object> {
  columns: ColumnConfig<T>[]
  data: T[]
  rowKey?: keyof T | ((record: T) => string)
  wrapperClassName?: string
  className?: string

  // ── 可选增强功能 ─────────────────────────────────────────────
  /** true 使用默认配置，传对象可自定义 placeholder / filterKey */
  searchable?: boolean | SearchableConfig
  /** true 默认 10 条/页，传对象可自定义 pageSize */
  pagination?: boolean | PaginationConfig
  /** 启用行多选（自动注入 checkbox 列） */
  selectable?: boolean
  /** 行选中状态变化时的回调，参数为当前所有选中行的原始数据 */
  onSelectionChange?: (rows: T[]) => void
  /** 是否显示列显示/隐藏切换面板 */
  columnToggle?: boolean
  /** 空数据时展示的文案，默认 'No results.' */
  emptyText?: string
  /** 是否处于加载状态 */
  loading?: boolean
}
