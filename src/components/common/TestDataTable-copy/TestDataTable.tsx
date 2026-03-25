'use client'

import type {
  PaginationState,
  RowSelectionState,
  SortingState
} from '@tanstack/react-table'

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

import { TablePagination } from './components'
// import { Pagination } from './components'
import { buildColumnDefs, buildGetRowId, resolvePaginationState } from './utils'

/* ------------  Create useDataTable  ------------ */
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
  className
}: TestDataTableProps<T>) {
  const enablePagination = !!pagination
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
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
      ...(enablePagination && { pagination: paginationState })
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    // Pagination
    ...(enablePagination && {
      getPaginationRowModel: paginationRowModel,
      onPaginationChange: setPaginationState
    })
  })

  // 选中行变化时通知外部
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

  return (
    <div className={wrapClassName}>
      {/* Table Main */}
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

      {/* 分页 */}
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
