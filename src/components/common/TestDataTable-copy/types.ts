import type {
  PaginationInitialTableState,
  RowData
} from '@tanstack/react-table'

// ── TanStack meta type extension ───────────────────────────────────
declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    headClassName?: string
    cellClassName?: string
  }
}

export interface ColumnConfig<T> {
  key: string
  title: string
  className?: string
  headClassName?: string
  cellClassName?: string
  /** 是否允许排序，默认 false */
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

export interface TestDataTableProps<T extends object> {
  columns: ColumnConfig<T>[]
  data: T[]
  wrapClassName?: string
  className?: string

  /** 自定义行 key，用于 TanStack 的 getRowId */
  rowKey?: keyof T | ((record: T) => string)

  /* -----  Optional enhancements  ----- */
  /** true 默认 10 条/页，传数字可自定义 pageSize */
  pagination?: boolean | PaginationInitialTableState
  /** 启用行多选（自动注入 checkbox 列） */
  selectable?: boolean
  /** 行选中状态变化时的回调，参数为当前所有选中行的原始数据 */
  onSelectionChange?: (rows: T[]) => void
  /** 空数据时展示的文案，默认 'No results.' */
  emptyText?: string
  /** 是否处于加载状态 */
  loading?: boolean
}

// export interface DataTableProps<T extends object> {
//   columns: ColumnConfig<T>[]
//   data: T[]
//   rowKey?: keyof T | ((record: T) => string)
//   wrapperClassName?: string
//   className?: string

//   // ── 可选增强功能 ─────────────────────────────────────────────
//   /** true 使用默认配置，传对象可自定义 placeholder / filterKey */
//   searchable?: boolean | SearchableConfig
//   /** true 默认 10 条/页，传对象可自定义 pageSize */
//   pagination?: boolean | PaginationConfig
//   /** 启用行多选（自动注入 checkbox 列） */
//   selectable?: boolean
//   /** 行选中状态变化时的回调，参数为当前所有选中行的原始数据 */
//   onSelectionChange?: (rows: T[]) => void
//   /** 是否显示列显示/隐藏切换面板 */
//   columnToggle?: boolean
//   /** 空数据时展示的文案，默认 'No results.' */
//   emptyText?: string
//   /** 是否处于加载状态 */
//   loading?: boolean
// }
