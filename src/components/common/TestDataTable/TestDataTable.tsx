'use client'

import type {
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import type { ColumnVisibilityItem } from './components/TableToolbar'
import type { TestDataTableProps } from './types'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'
import { cn } from '@/lib/utils'

import { TablePagination, TableToolbar } from './components'
import { buildColumnDefs, buildGetRowId, resolvePaginationState } from './utils'

/* ── Stable model factories (avoid re-creation on each render) ─── */
const coreRowModel = getCoreRowModel()
const sortedRowModel = getSortedRowModel()
const paginationRowModel = getPaginationRowModel()

// ── TestDataTable ───────────────────────────────────────────────
export function TestDataTable<T extends object>({
  columns: columnConfigs,
  data,
  rowKey,
  pagination,
  selectable = false,
  onSelectionChange,
  emptyText = 'No results.',
  loading,
  wrapClassName,
  className,
  // Toolbar
  toolbar,
  onFilter
}: TestDataTableProps<T>) {
  const enablePagination = !!pagination

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    resolvePaginationState(pagination)
  )

  const getRowId = useMemo(() => buildGetRowId(rowKey), [rowKey])

  const columns = useMemo(
    () => buildColumnDefs(columnConfigs, selectable),
    // prettier-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columnConfigs.map((c) => ({
      key: c.key,
      sortable: c.sortable,
    }))), selectable]
  )

  const table = useReactTable<T>({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      ...(enablePagination && { pagination: paginationState })
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    ...(enablePagination && {
      getPaginationRowModel: paginationRowModel,
      onPaginationChange: setPaginationState
    })
  })

  // ── 选中行变化时通知外部 ──────────────────────────────────────
  const stableOnSelectionChange = useCallback(
    (rows: T[]) => onSelectionChange?.(rows),
    [onSelectionChange]
  )

  useEffect(() => {
    if (!selectable) return
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original)
    stableOnSelectionChange(selectedRows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, stableOnSelectionChange, selectable])

  // ── 从 table 实例派生列显隐数据，传给 Toolbar ─────────────────
  // enableHiding: false 的列（如 select checkbox）会被自动排除
  const columnVisibilities = useMemo<ColumnVisibilityItem[]>(
    () =>
      table
        .getAllColumns()
        .filter((col) => col.getCanHide())
        .map((col) => ({
          id: col.id,
          // 优先取 columnDef.header string，回退到 id
          label:
            typeof col.columnDef.header === 'string'
              ? col.columnDef.header
              : col.id,
          isVisible: col.getIsVisible()
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnVisibility, columns]
  )

  // ── render ────────────────────────────────────────────────────

  return (
    <div className={wrapClassName}>
      {/* Toolbar */}
      {toolbar && (
        <TableToolbar
          filterFields={toolbar.filterFields}
          onFilter={onFilter}
          actions={toolbar.actions}
          columnToggle={toolbar.columnToggle}
          columnVisibilities={columnVisibilities}
          onColumnVisibilityChange={(id, visible) =>
            table.getColumn(id)?.toggleVisibility(visible)
          }
        />
      )}

      {/* Table */}
      <div className={cn('overflow-hidden rounded-md border', className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.headClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.cellClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <TablePagination
          pageIndex={paginationState.pageIndex}
          pageSize={paginationState.pageSize}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onPageIndexChange={table.setPageIndex}
          onPageSizeChange={table.setPageSize}
          onPreviousPage={table.previousPage}
          onNextPage={table.nextPage}
        />
      )}
    </div>
  )
}
