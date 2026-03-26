'use client'

import type {
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import type { ColumnVisibilityItem, DataTableProps } from './types'

import { css } from '@linaria/core'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Fragment, useMemo, useRef, useState } from 'react'

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

// ── CSS helpers ────────────────────────────────────────────────

const tableFirstColPadding = css`
  & th:first-child,
  & td:first-child {
    padding-left: 1rem;
  }
`
const tableFirstColPaddingRight = css`
  & th:first-child,
  & td:first-child {
    padding-right: 0.25rem;
  }
`
const tableLastColPadding = css`
  & th:last-child,
  & td:last-child {
    padding-right: 1rem;
  }
`

/* ── Stable model factories ───────────────────────────────────── */
const coreRowModel = getCoreRowModel()
const filteredRowModel = getFilteredRowModel()
const sortedRowModel = getSortedRowModel()
const paginationRowModel = getPaginationRowModel()
const expandedRowModel = getExpandedRowModel()

// ── DataTable ──────────────────────────────────────────────────
export function DataTable<T extends object>({
  columns: columnConfigs,
  data,
  rowKey,
  pagination,
  actions,
  selectable = false,
  tableRef,
  emptyText = 'No results.',
  loading,
  wrapClassName,
  className,
  toolbar,
  expandable
}: DataTableProps<T>) {
  const enablePagination = !!pagination
  const enableClientFilter = !!toolbar && toolbar.filterMode !== 'manual'
  const enableExpandable = !!expandable
  const indentSize = expandable?.indentSize ?? 20

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    resolvePaginationState(pagination)
  )

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const getRowId = useMemo(() => buildGetRowId(rowKey), [rowKey])

  const actionsRef = useRef(actions)
  actionsRef.current = actions

  const columns = useMemo(
    () =>
      buildColumnDefs(
        columnConfigs,
        selectable,
        actionsRef.current,
        expandable
      ),
    // prettier-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columnConfigs.map((c) => ({ key: c.key, sortable: c.sortable }))), selectable, expandable]
  )

  const table = useReactTable<T>({
    data,
    columns,
    getRowId,
    getSubRows: enableExpandable
      ? (row) => expandable.getChildren?.(row) ?? []
      : undefined,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      expanded,
      ...(enablePagination && { pagination: paginationState })
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableExpandable && { onExpandedChange: setExpanded }),
    getCoreRowModel: coreRowModel,
    ...(enableClientFilter && { getFilteredRowModel: filteredRowModel }),
    getSortedRowModel: sortedRowModel,
    ...(enableExpandable && { getExpandedRowModel: expandedRowModel }),
    ...(enablePagination && {
      getPaginationRowModel: paginationRowModel,
      onPaginationChange: setPaginationState
    })
  })

  // ── 暴露 table 实例 ────────────────────────────────────────────
  if (tableRef) {
    tableRef.current = table
  }

  // ── 列显隐数据派生 ─────────────────────────────────────────────
  const columnVisibilities = useMemo<ColumnVisibilityItem[]>(
    () =>
      table
        .getAllColumns()
        .filter((col) => col.getCanHide())
        .map((col) => ({
          id: col.id,
          label:
            typeof col.columnDef.header === 'string'
              ? col.columnDef.header
              : col.id,
          isVisible: col.getIsVisible()
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnVisibility, columns]
  )

  // ── Row 渲染 ──────────────────────────────────────────────────
  const renderRow = (row: Row<T>) => {
    // Tree 模式：在第一个内容列（非 select/expand）加缩进
    const firstContentCellIndex = row
      .getVisibleCells()
      .findIndex(
        (cell) => cell.column.id !== 'select' && cell.column.id !== 'expand'
      )

    return (
      <Fragment key={row.id}>
        {/* ── 数据行 ── */}
        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
          {row.getVisibleCells().map((cell, cellIndex) => {
            const isFirstContentCell =
              enableExpandable && cellIndex === firstContentCellIndex
            const depthIndent =
              isFirstContentCell && row.depth > 0
                ? row.depth * indentSize
                : undefined

            return (
              <TableCell
                key={cell.id}
                className={cn(
                  cell.column.columnDef.meta?.className,
                  cell.column.columnDef.meta?.cellClassName
                )}
                style={depthIndent ? { paddingLeft: depthIndent } : undefined}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )
          })}
        </TableRow>
      </Fragment>
    )
  }

  // ── render ─────────────────────────────────────────────────────

  return (
    <div className={wrapClassName}>
      {toolbar && (
        <TableToolbar
          filterFields={toolbar.filterFields}
          filterMode={toolbar.filterMode}
          onFilter={toolbar.onFilter}
          table={table}
          actions={toolbar.actions}
          columnToggle={toolbar.columnToggle}
          columnVisibilities={columnVisibilities}
          onColumnVisibilityChange={(id, visible) =>
            table.getColumn(id)?.toggleVisibility(visible)
          }
        />
      )}

      <div
        className={cn(
          'overflow-hidden rounded-md border',
          tableFirstColPadding,
          selectable && tableFirstColPaddingRight,
          !actions && tableLastColPadding,
          className
        )}
      >
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
              table.getRowModel().rows.map((row) => renderRow(row))
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
