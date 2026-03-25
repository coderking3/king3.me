/* ------------ Parse pagination prop ------------ */

import type {
  ColumnDef,
  PaginationInitialTableState,
  PaginationState,
  Row
} from '@tanstack/react-table'

import type { ColumnConfig, TestDataTableProps } from './types'

import { Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'

import { TableSortableHeader } from './components/TableSortableHeader'

const DEFAULT_PAGINATION_STATE = {
  pageIndex: 0,
  pageSize: 10
}

export function resolvePaginationState(
  pagination?: boolean | PaginationInitialTableState
): PaginationState {
  if (!pagination || pagination === true) return DEFAULT_PAGINATION_STATE

  return { ...DEFAULT_PAGINATION_STATE, ...pagination }
}

/* ------------  Build getRowId from rowKey prop  ------------ */

export function buildGetRowId<T extends object>(
  rowKey?: TestDataTableProps<T>['rowKey']
): ((originalRow: T, index: number, parent?: Row<T>) => string) | undefined {
  if (!rowKey) return undefined
  if (typeof rowKey === 'function')
    return (originalRow, index) => rowKey(originalRow) ?? String(index)
  return (originalRow, index) => String((originalRow as any)[rowKey] ?? index)
}

/* ------------  Convert ColumnConfig[] to TanStack ColumnDef[]  ------------ */

export function buildColumnDefs<T extends object>(
  configs: ColumnConfig<T>[],
  selectable?: boolean
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
            checked={allSelected || someSelected}
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
      enableHiding: false
    })
  }

  cols.push(
    ...configs.map<ColumnDef<T>>((col, index) => {
      const isActions = col.key === 'actions'
      const isFirst = index === 0
      const isLast = index === configs.length - 1

      return {
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
        cell: col.render
          ? ({ row }) =>
              col.render!(
                (row.original as any)[col.key],
                row.original,
                row.index
              )
          : ({ row }) => String((row.original as any)[col.key] ?? ''),
        meta: {
          className: cn(
            isFirst && 'pl-4',
            !isActions && isLast && 'pr-4',
            col.className
          ),
          headClassName: cn(col.headClassName, isActions && 'text-center'),
          cellClassName: col.cellClassName
        }
      }
    })
  )

  return cols
}
