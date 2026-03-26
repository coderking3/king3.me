import type {
  PaginationInitialTableState,
  RowData,
  Table
} from '@tanstack/react-table'

// ── TanStack meta type extension ────────────────────────────────
declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    headClassName?: string
    cellClassName?: string
  }
}

// ── Column config ───────────────────────────────────────────────

export interface ColumnConfig<T> {
  key: string
  title: string
  className?: string
  headClassName?: string
  cellClassName?: string
  /** Whether sorting is enabled, default false */
  sortable?: boolean
  /** Whether the column can be toggled in the visibility panel, default true. Set false for action columns. */
  enableHiding?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

export interface ActionConfig<T> {
  /** Column title, default 'Actions' */
  title?: string
  /** Column width className, e.g. 'w-24' */
  className?: string
  /** Render action buttons */
  render: (record: T, index: number) => React.ReactNode
}

// ── Filter fields ───────────────────────────────────────────────

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

/** Supports input / select filter fields. Extendable with date-range etc. */
export type FilterField = InputFilterField | SelectFilterField

// ── Toolbar config ──────────────────────────────────────────────

export interface ToolbarConfig {
  /** Left-side filter field configs */
  filterFields?: FilterField[]
  /**
   * Filter mode:
   * - 'auto': filter on input (client-side), uses TanStack column filtering
   * - 'manual': trigger onFilter callback on Query button click (server-side)
   * Default 'auto'
   */
  filterMode?: 'auto' | 'manual'
  /** Callback for Query / Reset in manual mode */
  onFilter?: (values: Record<string, string>) => void
  /** Right-side custom action area for "Add", "Export" buttons etc. */
  actions?: React.ReactNode
  /** Enable column visibility dropdown (View button). Column data is derived internally by DataTable. */
  columnToggle?: boolean
}

/** Derived from the table instance by DataTable and passed to Toolbar. No manual maintenance needed. */
export interface ColumnVisibilityItem {
  id: string
  /** Display name, derived from ColumnConfig.title */
  label: string
  isVisible: boolean
}

// ── DataTable props ─────────────────────────────────────────────

export interface DataTableProps<T extends object> {
  /** Column configurations */
  columns: ColumnConfig<T>[]
  /** Data source */
  data: T[]
  /** Wrapper container className */
  wrapClassName?: string
  /** Table container className */
  className?: string
  /** Custom row key for TanStack getRowId */
  rowKey?: keyof T | ((record: T, index: number) => string)

  /* ── Optional enhancements ── */

  /** Pagination: true for default 10 rows/page, or pass an object to customize pageSize / pageIndex */
  pagination?: boolean | PaginationInitialTableState
  /** Enable multi-row selection (auto-injects checkbox column) */
  selectable?: boolean
  /** Expose the TanStack Table instance for external access (e.g. selected rows) */
  tableRef?: React.RefObject<Table<T> | null>
  /** Action column config, appended as the last column (non-sortable, non-hideable) */
  actions?: ActionConfig<T>
  /** Text shown when data is empty, default 'No results.' */
  emptyText?: string
  /** Whether the table is in a loading state */
  loading?: boolean

  /* ── Toolbar ── */

  /** Toolbar config: filter fields, action buttons, column visibility toggle */
  toolbar?: ToolbarConfig
}
