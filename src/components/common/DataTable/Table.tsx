'use client'

import type { DataTableProps } from './types'

import { flexRender } from '@tanstack/react-table'

import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'
import { cn } from '@/lib/utils'

import { TablePagination } from './components/TablePagination'
import { TableToolbar } from './components/TableToolbar'
import { useDataTable } from './hooks/useDataTable'

export function DataTable<T extends object>({
  columns: columnConfigs,
  data,
  rowKey,
  wrapperClassName,
  className,
  searchable,
  pagination,
  selectable,
  onSelectionChange,
  columnToggle,
  emptyText = 'No results.',
  loading
}: DataTableProps<T>) {
  const { table, searchConfig, columns } = useDataTable({
    columns: columnConfigs,
    data,
    rowKey,
    searchable,
    pagination,
    selectable,
    onSelectionChange
  })

  return (
    <div className={wrapperClassName}>
      {/* 工具栏：搜索 + 列切换 */}
      <TableToolbar
        table={table}
        searchConfig={searchConfig}
        columnToggle={columnToggle}
      />

      {/* 表格主体 */}
      <div className={cn('overflow-hidden rounded-md border', className)}>
        <BaseTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
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
                  )
                })}
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
        </BaseTable>
      </div>

      {/* 页脚：选中计数 + 分页 */}
      <TablePagination
        table={table}
        selectable={selectable}
        showPagination={!!pagination}
      />
    </div>
  )
}
