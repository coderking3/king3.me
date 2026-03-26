/* ------------ Parse pagination prop ------------ */

import type {
  ColumnDef,
  PaginationInitialTableState,
  PaginationState,
  Row
} from '@tanstack/react-table'

import type { ActionConfig, ColumnConfig, DataTableProps } from './types'

import { Checkbox } from '@/components/ui'

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
  rowKey?: DataTableProps<T>['rowKey']
): ((originalRow: T, index: number, parent?: Row<T>) => string) | undefined {
  if (!rowKey) return undefined
  if (typeof rowKey === 'function')
    return (originalRow, index) => rowKey(originalRow, index) ?? String(index)
  return (originalRow, index) => String((originalRow as any)[rowKey] ?? index)
}

/* ------------  Convert ColumnConfig[] to TanStack ColumnDef[]  ------------ */

export function buildColumnDefs<T extends object>(
  configs: ColumnConfig<T>[],
  selectable?: boolean,
  actions?: ActionConfig<T>
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
      meta: {
        className: 'w-10'
      }
    })
  }

  cols.push(
    ...configs.map<ColumnDef<T>>((col) => {
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
        enableHiding: col.enableHiding ?? true,
        cell: col.render
          ? ({ row }) =>
              col.render!(
                (row.original as any)[col.key],
                row.original,
                row.index
              )
          : ({ row }) => String((row.original as any)[col.key] ?? ''),
        meta: {
          className: col.className,
          headClassName: col.headClassName,
          cellClassName: col.cellClassName
        }
      }
    })
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
