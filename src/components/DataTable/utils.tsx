import type {
  ColumnDef,
  ExpandedState,
  PaginationState,
  Row
} from '@tanstack/react-table'

import type {
  ActionConfig,
  ColumnConfig,
  DataTableProps,
  ExpandableConfig
} from './types'

import { ChevronDown, ChevronRight } from 'lucide-react'

import { Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'

import { TableSortableHeader } from './components/TableSortableHeader'

/* --- Pagination --- */

const DEFAULT_PAGINATION_STATE: PaginationState = {
  pageIndex: 0,
  pageSize: 10
}

export function resolvePaginationState(
  pagination?: boolean | Partial<PaginationState>
): PaginationState {
  if (!pagination || pagination === true) return DEFAULT_PAGINATION_STATE
  return { ...DEFAULT_PAGINATION_STATE, ...pagination }
}

/* --- Expanded state --- */

export function resolveDefaultExpanded(
  defaultExpanded?: true | string[]
): ExpandedState {
  if (defaultExpanded === true) return true
  if (Array.isArray(defaultExpanded)) {
    return Object.fromEntries(defaultExpanded.map((id) => [id, true]))
  }
  return {}
}

/* --- Row ID --- */

export function buildGetRowId<T extends object>(
  rowKey?: DataTableProps<T>['rowKey']
): ((originalRow: T, index: number, parent?: Row<T>) => string) | undefined {
  if (!rowKey) return undefined
  if (typeof rowKey === 'function')
    return (originalRow, index) => rowKey(originalRow, index) ?? String(index)
  return (originalRow, index) => String((originalRow as any)[rowKey] ?? index)
}

/* --- Column definitions --- */

export function buildColumnDefs<T extends object>(
  configs: ColumnConfig<T>[],
  selectable?: boolean,
  actions?: ActionConfig<T>,
  expandable?: ExpandableConfig<T>,
  dragHandle?: boolean
): ColumnDef<T>[] {
  const cols: ColumnDef<T>[] = []

  if (selectable) {
    cols.push({
      id: 'select',
      header: ({ table }) => {
        const allSelected = table.getIsAllPageRowsSelected()
        const someSelected = table.getIsSomePageRowsSelected()
        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        )
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: 'w-10' }
    })
  }

  if (dragHandle) {
    cols.push({
      id: 'drag',
      header: '',
      enableSorting: false,
      enableHiding: false,
      cell: () => null,
      meta: {
        className: 'w-10',
        headClassName: 'w-10',
        cellClassName: 'w-10'
      }
    })
  }

  if (expandable) {
    cols.push({
      id: 'expand',
      header: '',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        let canExpand: boolean
        if (expandable.rowExpandable) {
          canExpand = expandable.rowExpandable(row.original)
        } else if (expandable.render) {
          canExpand = true
        } else {
          canExpand = (row.subRows?.length ?? 0) > 0
        }

        const isExpanded = row.getIsExpanded()

        return (
          <button
            type="button"
            onClick={
              canExpand
                ? (e: React.MouseEvent) => {
                    e.stopPropagation()
                    row.toggleExpanded()
                  }
                : undefined
            }
            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
            className={cn(
              'text-muted-foreground hover:bg-muted flex items-center justify-center rounded p-0.5 transition-colors',
              !canExpand && 'pointer-events-none invisible'
            )}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )
      },
      meta: { className: 'w-10' }
    })
  }

  cols.push(
    ...configs.map<ColumnDef<T>>((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: col.sortable
        ? ({ column }) => (
            <TableSortableHeader
              title={col.title}
              sorted={column.getIsSorted()}
              onToggleSorting={column.getToggleSortingHandler()}
            />
          )
        : col.title,
      enableSorting: col.sortable ?? false,
      enableHiding: col.enableHiding ?? true,
      cell: col.render
        ? ({ row }) => {
            const value = row.original
              ? (row.original as any)[col.key]
              : undefined
            return col.render!(value, row.original, row.index)
          }
        : ({ row }) => String((row.original as any)?.[col.key] ?? ''),
      meta: {
        className: col.className,
        headClassName: col.headClassName,
        cellClassName: col.cellClassName
      }
    }))
  )

  if (actions) {
    cols.push({
      id: 'actions',
      header: actions.title ?? 'Actions',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => actions.render(row.original, row.index),
      meta: {
        className: actions.className,
        headClassName: 'text-center'
      }
    })
  }

  return cols
}
