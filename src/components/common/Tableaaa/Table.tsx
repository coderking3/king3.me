'use client'

import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import type { TableProps } from './types'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Settings2
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  Table as BaseTable,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'

// ── 排序 Header ─────────────────────────────────────────────
function SortableHeader({ column, title }: { column: any; title: string }) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  )
}

// ── 主组件 ──────────────────────────────────────────────────
export function Table<T extends object>({
  columns: columnConfigs,
  data,
  className,
  searchable,
  pagination,
  selectable,
  onSelectionChange,
  columnToggle,
  emptyText = 'No results.',
  loading
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // 解析 searchable 配置
  const searchConfig = useMemo(() => {
    if (!searchable) return null
    const firstKey = columnConfigs.find((c) => c.key !== 'actions')?.key ?? ''
    if (searchable === true)
      return { placeholder: 'Search...', filterKey: firstKey }
    return {
      placeholder: searchable.placeholder ?? 'Search...',
      filterKey: searchable.filterKey ?? firstKey
    }
  }, [searchable, columnConfigs])

  // 解析 pagination 配置
  const pageSize = useMemo(() => {
    if (!pagination) return undefined
    return pagination === true ? 10 : (pagination.pageSize ?? 10)
  }, [pagination])

  // 将 ColumnConfig[] 转换为 TanStack ColumnDef[]
  const columns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = []

    if (selectable) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
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
      ...columnConfigs.map((col) => ({
        id: col.key,
        accessorKey: col.key,
        header: col.sortable
          ? ({ column }: any) => (
              <SortableHeader column={column} title={col.title} />
            )
          : col.title,
        cell: col.render
          ? ({ row }: any) =>
              col.render!(
                (row.original as any)[col.key],
                row.original as T,
                row.index
              )
          : ({ row }: any) => String((row.original as any)[col.key] ?? ''),
        enableSorting: col.sortable ?? false,
        enableHiding: col.enableHiding ?? true,
        meta: { className: col.className }
      }))
    )

    return cols
  }, [columnConfigs, selectable])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    initialState: pageSize ? { pagination: { pageSize } } : undefined
  })

  // 选中行变化时回调
  useEffect(() => {
    if (!onSelectionChange) return
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)
    onSelectionChange(selectedRows)
  }, [rowSelection]) // eslint-disable-line react-hooks/exhaustive-deps

  const showToolbar = searchable || columnToggle
  const showFooter = pagination || selectable

  return (
    <div className={className}>
      {/* ── Toolbar ── */}
      {showToolbar && (
        <div className="mb-4 flex items-center gap-2">
          {searchConfig && (
            <Input
              placeholder={searchConfig.placeholder}
              value={
                (table
                  .getColumn(searchConfig.filterKey)
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(e) =>
                table
                  .getColumn(searchConfig.filterKey)
                  ?.setFilterValue(e.target.value)
              }
              className="max-w-xs"
            />
          )}
          {columnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="ml-auto h-8">
                  <Settings2 className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize"
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-md border">
        <BaseTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={(header.column.columnDef.meta as any)?.className}
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
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={(cell.column.columnDef.meta as any)?.className}
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
        </BaseTable>
      </div>

      {/* ── Footer ── */}
      {showFooter && (
        <div className="flex items-center justify-between py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {selectable && (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            )}
          </div>

          {pagination && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rows per page</span>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(v) => table.setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
