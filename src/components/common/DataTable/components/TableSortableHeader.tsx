import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui'

export type SortDirection = 'asc' | 'desc' | false

interface TableSortableHeaderProps {
  title: string
  sorted: SortDirection
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
