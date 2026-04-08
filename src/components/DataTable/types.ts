import type {
  PaginationState,
  Row,
  RowData,
  Table
} from '@tanstack/react-table'

/* --- TanStack meta extension --- */

declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    headClassName?: string
    cellClassName?: string
  }
}

/* --- Column --- */

export interface ColumnConfig<T> {
  key: string
  title: string
  className?: string
  headClassName?: string
  cellClassName?: string
  /** Default: false */
  sortable?: boolean
  /** Default: true */
  enableHiding?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

/* --- Expand mode --- */

export type ExpandMode = 'panel' | 'tree' | null

/* --- Expandable --- */

export interface ExpandableConfig<T> {
  /** Control which rows show the expand toggle */
  rowExpandable?: (record: T) => boolean
  /**
   * Default expanded state.
   * - `true`: all rows
   * - `string[]`: matching row IDs
   */
  defaultExpanded?: true | string[]

  /** Tree mode: return child rows. Ignored when `render` is provided. */
  getChildren?: (record: T) => T[] | undefined
  /** Tree mode indent per depth level (px). Default: 20 */
  indentSize?: number

  /** Panel mode: render detail content below a row. Takes priority over `getChildren`. */
  render?: (record: T, row: Row<T>) => React.ReactNode
}

/* --- Action column --- */

export interface ActionConfig<T> {
  /** Default: 'Actions' */
  title?: string
  className?: string
  render: (record: T, index: number) => React.ReactNode
}

/* --- Filter fields --- */

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

export type FilterField = InputFilterField | SelectFilterField

/* --- Toolbar --- */

export interface ToolbarConfig {
  filterFields?: FilterField[]
  /**
   * - `'auto'`: client-side filtering on input change
   * - `'manual'`: server-side, triggers `onFilter` on button click
   *
   * Default: `'auto'`
   */
  filterMode?: 'auto' | 'manual'
  onFilter?: (values: Record<string, string>) => void
  /** Right-side custom actions (e.g. "Add", "Export" buttons) */
  actions?: React.ReactNode
  columnToggle?: boolean
}

export interface ColumnVisibilityItem {
  id: string
  label: string
  isVisible: boolean
}

/* --- Drag sort --- */

export interface DragSortConfig<T> {
  /**
   * Enables row drag sorting for the current table data.
   * Requires a stable `rowKey`.
   */
  enabled?: boolean
  /** Default: `true` */
  handle?: boolean
  disabled?: boolean
  onDragEnd: (
    nextData: T[],
    context: { activeId: string; overId: string }
  ) => void | Promise<void>
}

/* --- DataTable props --- */

export interface DataTableProps<T extends object> {
  columns: ColumnConfig<T>[]
  data: T[]
  wrapClassName?: string
  className?: string
  rowKey?: keyof T | ((record: T, index: number) => string)

  /** `true` for default (10/page), or `{ pageSize, pageIndex }` */
  pagination?: boolean | Partial<PaginationState>
  /** Auto-injects checkbox column */
  selectable?: boolean
  /** Expose TanStack Table instance */
  tableRef?: React.RefObject<Table<T> | null>
  actions?: ActionConfig<T>
  /** Default: 'No results.' */
  emptyText?: string
  loading?: boolean

  expandable?: ExpandableConfig<T>
  toolbar?: ToolbarConfig
  dragSort?: DragSortConfig<T>
}
