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

// ── Column config ──────────────────────────────────────────────────
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

// ── Filter fields ──────────────────────────────────────────────────

export interface InputFilterField {
  type?: 'input'
  key: string
  label: string
  placeholder?: string
}

export interface SelectFilterField {
  type: 'select'
  key: string
  label: string
  placeholder?: string
  options: { label: string; value: string }[]
}

/** 支持 input / select 两种筛选字段，后续可扩展 date-range 等 */
export type FilterField = InputFilterField | SelectFilterField

// ── Toolbar config ─────────────────────────────────────────────────

export interface ToolbarConfig {
  /**
   * 左侧筛选字段，每项渲染为带 label 的 Input 或 Select。
   * 用户点击 Query 后统一通过 onFilter 回调返回当前值。
   */
  filterFields?: FilterField[]
  /**
   * 右侧自定义操作区，放"新增"、"导出"等业务按钮。
   * 接收任意 ReactNode，完全由调用方控制。
   */
  actions?: React.ReactNode
  /**
   * 开启列显隐 Dropdown（View 按钮）。
   * 列数据由 TestDataTable 内部从 table 实例派生，无需外部传入。
   */
  columnToggle?: boolean
}

// ── Main component props ───────────────────────────────────────────

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
  /** 行选中状态变化时的回调 */
  onSelectionChange?: (rows: T[]) => void
  /** 空数据时展示的文案，默认 'No results.' */
  emptyText?: string
  /** 是否处于加载状态 */
  loading?: boolean

  /* -----  Toolbar  ----- */
  /** Toolbar 配置：筛选字段、右侧操作按钮、列显隐开关 */
  toolbar?: ToolbarConfig
  /**
   * 点击 Query 按钮时的回调，参数为当前所有筛选字段的值。
   * 点击 Reset 时以全空对象调用，方便调用方统一处理。
   */
  onFilter?: (values: Record<string, string>) => void
}
