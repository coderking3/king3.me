import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui'

export type SortDirection = 'asc' | 'desc' | false

interface TableSortableHeaderProps {
  title: string
  sorted: SortDirection
  /** 直接传入 column.getToggleSortingHandler()，内置 none → asc → desc → none 三态循环 */
  onToggleSorting?: (event: unknown) => void
}

export function TableSortableHeader({
  title,
  sorted,
  onToggleSorting
}: TableSortableHeaderProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="data-[state=open]:bg-accent -ml-3 h-8"
      onClick={onToggleSorting}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp className="ml-2 h-4 w-4 opacity-50" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="ml-2 h-4 w-4 opacity-50" />
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  )
}
