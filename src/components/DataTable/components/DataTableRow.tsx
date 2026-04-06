import type { Row } from '@tanstack/react-table'

import type { ExpandableConfig } from '../types'
import type { ExpandMode } from './SortableTableRow'

import { flexRender } from '@tanstack/react-table'
import { Fragment } from 'react'

import { TableCell, TableRow } from '@/components/ui'
import { cn } from '@/lib/utils'

interface DataTableRowProps<T extends object> {
  row: Row<T>
  enableExpandable: boolean
  expandMode: ExpandMode
  indentSize: number
  expandable?: ExpandableConfig<T>
  /** Extra className on the main TableRow */
  className?: string
  /** Extra props on the main TableRow (e.g. ref, style, dnd attributes) */
  rowProps?: React.ComponentProps<typeof TableRow>
  /** Override rendering for a specific cell by column id */
  cellOverride?: (
    columnId: string,
    defaultContent: React.ReactNode
  ) => React.ReactNode
}

export function DataTableRow<T extends object>({
  row,
  enableExpandable,
  expandMode,
  indentSize,
  expandable,
  className,
  rowProps,
  cellOverride
}: DataTableRowProps<T>) {
  const firstContentCellIndex = enableExpandable
    ? row
        .getVisibleCells()
        .findIndex(
          (cell) =>
            cell.column.id !== 'select' &&
            cell.column.id !== 'drag' &&
            cell.column.id !== 'expand'
        )
    : -1

  return (
    <Fragment>
      <TableRow
        data-state={row.getIsSelected() ? 'selected' : undefined}
        className={className}
        {...rowProps}
      >
        {row.getVisibleCells().map((cell, cellIndex) => {
          const isFirstContentCell = cellIndex === firstContentCellIndex
          const depthIndent =
            isFirstContentCell && row.depth > 0
              ? row.depth * indentSize
              : undefined

          const defaultContent = flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          )

          return (
            <TableCell
              key={cell.id}
              className={cn(
                cell.column.columnDef.meta?.className,
                cell.column.columnDef.meta?.cellClassName
              )}
              style={depthIndent ? { paddingLeft: depthIndent } : undefined}
            >
              {cellOverride
                ? cellOverride(cell.column.id, defaultContent)
                : defaultContent}
            </TableCell>
          )
        })}
      </TableRow>

      {expandMode === 'panel' && row.getIsExpanded() && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={row.getVisibleCells().length} className="p-0">
            {expandable!.render!(row.original, row)}
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
}
