import type { Row } from '@tanstack/react-table'

import type { ExpandableConfig } from '../types'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

import { DataTableRow } from './DataTableRow'

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative' as const, zIndex: 1 } : undefined)
  }

  const wholeRowDraggable = !dragHandle && !dragDisabled

  return (
    <DataTableRow
      row={row}
      enableExpandable={enableExpandable}
      expandMode={expandMode}
      indentSize={indentSize}
      expandable={expandable}
      className={cn(
        isDragging && 'bg-muted opacity-90',
        wholeRowDraggable && 'cursor-grab active:cursor-grabbing'
      )}
      rowProps={{
        ref: setNodeRef,
        style,
        ...(wholeRowDraggable ? { ...attributes, ...listeners } : {})
      }}
      cellOverride={(columnId, defaultContent) => {
        if (columnId !== 'drag') return defaultContent

        return (
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
        )
      }}
    />
  )
}
