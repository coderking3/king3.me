import type { Row } from '@tanstack/react-table'

import type { ExpandableConfig } from '../types'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender } from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'
import { Fragment } from 'react'

import { TableCell, TableRow } from '@/components/ui'
import { cn } from '@/lib/utils'

export type ExpandMode = 'panel' | 'tree' | null

interface SortableTableRowProps<T extends object> {
  row: Row<T>
  dragHandle: boolean
  dragDisabled: boolean
  enableExpandable: boolean
  expandMode: ExpandMode
  indentSize: number
  expandable?: ExpandableConfig<T>
}

export function SortableTableRow<T extends object>({
  row,
  dragHandle,
  dragDisabled,
  enableExpandable,
  expandMode,
  indentSize,
  expandable
}: SortableTableRowProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: row.id, disabled: dragDisabled })

  const firstContentCellIndex = row
    .getVisibleCells()
    .findIndex(
      (cell) =>
        cell.column.id !== 'select' &&
        cell.column.id !== 'drag' &&
        cell.column.id !== 'expand'
    )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative' as const, zIndex: 1 } : undefined)
  }

  return (
    <Fragment key={row.id}>
      <TableRow
        ref={setNodeRef}
        style={style}
        data-state={row.getIsSelected() ? 'selected' : undefined}
        className={cn(
          isDragging && 'bg-muted opacity-90',
          !dragHandle && !dragDisabled && 'cursor-grab active:cursor-grabbing'
        )}
        {...(!dragHandle && !dragDisabled
          ? { ...attributes, ...listeners }
          : {})}
      >
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
              {cell.column.id === 'drag' ? (
                <button
                  type="button"
                  aria-label="Reorder row"
                  disabled={dragDisabled}
                  className={cn(
                    'text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors',
                    !dragDisabled && 'cursor-grab active:cursor-grabbing',
                    dragDisabled && 'cursor-not-allowed opacity-40'
                  )}
                  style={{ touchAction: 'none' }}
                  {...(!dragDisabled ? { ...attributes, ...listeners } : {})}
                >
                  <GripVertical size={16} />
                </button>
              ) : (
                flexRender(cell.column.columnDef.cell, cell.getContext())
              )}
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
