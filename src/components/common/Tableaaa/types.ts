export interface ColumnConfig<T> {
  key: string
  title: string
  className?: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  sortable?: boolean // 是否允许排序
  enableHiding?: boolean // 是否允许在 View 面板中隐藏（默认 true）
}

export interface TableProps<T extends object> {
  columns: ColumnConfig<T>[]
  data: T[]
  rowKey?: keyof T | ((record: T) => string)
  className?: string
  // ── 新增可选功能 ──────────────────────────────
  searchable?: boolean | { placeholder?: string; filterKey?: string }
  pagination?: boolean | { pageSize?: number }
  selectable?: boolean
  onSelectionChange?: (rows: T[]) => void
  columnToggle?: boolean
  emptyText?: string
  loading?: boolean
}
