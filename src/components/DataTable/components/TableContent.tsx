import type { ColumnDef, HeaderGroup, Row } from '@tanstack/react-table'

import type { ExpandableConfig } from '../types'
import type { ExpandMode } from './SortableTableRow'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { flexRender } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'
import { cn } from '@/lib/utils'

import { DataTableRow } from './DataTableRow'
import { SortableTableRow } from './SortableTableRow'

interface TableContentProps<T extends object> {
  headerGroups: HeaderGroup<T>[]
  rows: Row<T>[]
  columns: ColumnDef<T>[]
  loading?: boolean
  emptyText: string
  enableDragSort: boolean
  dragDisabled: boolean
  dragHandle: boolean
  enableExpandable: boolean
  expandMode: ExpandMode
  indentSize: number
  expandable?: ExpandableConfig<T>
}

export function TableContent<T extends object>({
  headerGroups,
  rows,
  columns,
  loading,
  emptyText,
  enableDragSort,
  dragDisabled,
  dragHandle,
  enableExpandable,
  expandMode,
  indentSize,
  expandable
}: TableContentProps<T>) {
  return (
    <Table>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
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
        <TableBodyContent
          rows={rows}
          columns={columns}
          loading={loading}
          emptyText={emptyText}
          enableDragSort={enableDragSort}
          dragDisabled={dragDisabled}
          dragHandle={dragHandle}
          enableExpandable={enableExpandable}
          expandMode={expandMode}
          indentSize={indentSize}
          expandable={expandable}
        />
      </TableBody>
    </Table>
  )
}

/* --- Body content (separated for readability) --- */

function TableBodyContent<T extends object>({
  rows,
  columns,
  loading,
  emptyText,
  enableDragSort,
  dragDisabled,
  dragHandle,
  enableExpandable,
  expandMode,
  indentSize,
  expandable
}: {
  rows: Row<T>[]
  columns: ColumnDef<T>[]
  loading?: boolean
  emptyText: string
  enableDragSort: boolean
  dragDisabled: boolean
  dragHandle: boolean
  enableExpandable: boolean
  expandMode: ExpandMode
  indentSize: number
  expandable?: ExpandableConfig<T>
}) {
  if (loading) {
    return (
      <TableRow>
        <TableCell
          colSpan={columns.length}
          className="text-muted-foreground h-64 text-center"
        >
          Loading...
        </TableCell>
      </TableRow>
    )
  }

  if (!rows.length) {
    return (
      <TableRow>
        <TableCell
          colSpan={columns.length}
          className="text-muted-foreground h-64 text-center"
        >
          {emptyText}
        </TableCell>
      </TableRow>
    )
  }

  if (enableDragSort) {
    const dndRowIds = rows.map((row) => row.id)
    return (
      <SortableContext items={dndRowIds} strategy={verticalListSortingStrategy}>
        {rows.map((row) => (
          <SortableTableRow
            key={row.id}
            row={row}
            dragHandle={dragHandle}
            dragDisabled={dragDisabled}
            enableExpandable={enableExpandable}
            expandMode={expandMode}
            indentSize={indentSize}
            expandable={expandable}
          />
        ))}
      </SortableContext>
    )
  }

  return rows.map((row) => (
    <DataTableRow
      key={row.id}
      row={row}
      enableExpandable={enableExpandable}
      expandMode={expandMode}
      indentSize={indentSize}
      expandable={expandable}
    />
  ))
}
