'use client'

import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import type {
  ColumnConfig,
  DataTableProps,
  PaginationConfig,
  SearchableConfig
} from '../types'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Checkbox } from '@/components/ui'
import { cn } from '@/lib/utils'

import { SortableHeader } from '../components/SortableHeader'

// ── 将 ColumnConfig[] 转换为 TanStack ColumnDef[] ─────────────
function buildColumnDefs<T extends object>(
  columnConfigs: ColumnConfig<T>[],
  selectable: boolean
): ColumnDef<T>[] {
  const cols: ColumnDef<T>[] = []

  if (selectable) {
    cols.push({
      id: 'select',
      header: ({ table }) => {
        const checked =
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        return (
          <Checkbox
            checked={checked}
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
    ...columnConfigs.map<ColumnDef<T>>((col, index) => {
      const isActions = col.key === 'actions'
      const isFirst = index === 0
      const isLast = index === columnConfigs.length - 1

      return {
        id: col.key,
        accessorKey: col.key,
        header: col.sortable
          ? ({ column }) => <SortableHeader column={column} title={col.title} />
          : col.title,
        cell: col.render
          ? ({ row }) =>
              col.render!(
                (row.original as any)[col.key],
                row.original,
                row.index
              )
          : ({ row }) => String((row.original as any)[col.key] ?? ''),
        enableSorting: col.sortable ?? false,
        // enableHiding 默认 true（可被隐藏），actions 列建议外部传 false
        enableHiding: col.enableHiding ?? true,
        meta: {
          // 默认样式
          className: cn(
            isFirst && 'pl-4',
            !isActions && isLast && 'pr-4',
            col.className
          ),
          headClassName: cn(col.headClassName, isActions && 'text-center'),
          bodyClassName: col.cellClassName
        }
      }
    })
  )

  return cols
}

// ── 解析 searchable prop ──────────────────────────────────────
function resolveSearchConfig<T extends object>(
  searchable: boolean | SearchableConfig | undefined,
  columnConfigs: ColumnConfig<T>[]
): { placeholder: string; filterKey: string } | null {
  if (!searchable) return null
  const firstKey = columnConfigs.find((c) => c.key !== 'actions')?.key ?? ''
  if (searchable === true) {
    return { placeholder: 'Search...', filterKey: firstKey }
  }
  return {
    placeholder: searchable.placeholder ?? 'Search...',
    filterKey: searchable.filterKey ?? firstKey
  }
}

// ── 解析 pagination prop ──────────────────────────────────────
function resolvePageSize(
  pagination: boolean | PaginationConfig | undefined
): number | null {
  if (!pagination) return null
  return pagination === true ? 10 : (pagination.pageSize ?? 10)
}

// ── 将 rowKey prop 转换为 TanStack getRowId ───────────────────
function buildGetRowId<T extends object>(
  rowKey: DataTableProps<T>['rowKey']
): ((row: T, index: number) => string) | undefined {
  if (!rowKey) return undefined
  if (typeof rowKey === 'function')
    return (row, index) => rowKey(row) ?? String(index)
  return (row, index) => String((row as any)[rowKey] ?? index)
}

// ── getPaginationRowModel 稳定引用 ────────────────────────────
const stablePaginationRowModel = getPaginationRowModel()

// ── useDataTable ──────────────────────────────────────────────
export function useDataTable<T extends object>({
  columns: columnConfigs,
  data,
  rowKey,
  searchable,
  pagination,
  selectable = false,
  onSelectionChange
}: Pick<
  DataTableProps<T>,
  | 'columns'
  | 'data'
  | 'rowKey'
  | 'searchable'
  | 'pagination'
  | 'selectable'
  | 'onSelectionChange'
>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const searchConfig = useMemo(
    () => resolveSearchConfig(searchable, columnConfigs),
    // columnConfigs 引用可能每次变，只依赖 searchable 和第一个 key 即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchable, columnConfigs.map((c) => c.key).join(',')]
  )

  const pageSize = useMemo(() => resolvePageSize(pagination), [pagination])

  const columns = useMemo(
    () => buildColumnDefs(columnConfigs, selectable),
    // 同上，避免数组引用变化导致无效 memo 失效

    // prettier-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ JSON.stringify(columnConfigs.map((c) => ({
        key: c.key,
        sortable: c.sortable,
        enableHiding: c.enableHiding
    }))), selectable ]
  )

  const getRowId = useMemo(() => buildGetRowId(rowKey), [rowKey])

  const table = useReactTable<T>({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && { getPaginationRowModel: stablePaginationRowModel }),
    ...(pageSize && { initialState: { pagination: { pageSize } } })
  })

  // 选中行变化时通知外部，onSelectionChange 进依赖确保不产生陈旧闭包
  const stableOnSelectionChange = useCallback(
    (rows: T[]) => onSelectionChange?.(rows),
    [onSelectionChange]
  )

  useEffect(() => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)
    stableOnSelectionChange(selectedRows)
  }, [table, rowSelection, stableOnSelectionChange])
  // table 对象每次 render 都是新引用，不放入 deps；
  // rowSelection 状态变化即可驱动此 effect

  return { table, searchConfig, pageSize, columns }
}
