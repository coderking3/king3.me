'use client'

import { Settings2 } from 'lucide-react'

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input
} from '@/components/ui'

export interface ColumnVisibility {
  id: string
  isVisible: boolean
}

export interface ToolbarProps {
  /** 搜索相关 */
  searchValue?: string
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void

  /** 列显隐相关 */
  columnToggle?: boolean
  columns?: ColumnVisibility[]
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void
}

export function TableToolbar({
  searchValue,
  searchPlaceholder = 'Search...',
  onSearchChange,
  columnToggle,
  columns,
  onColumnVisibilityChange
}: ToolbarProps) {
  const showSearch = !!onSearchChange
  if (!showSearch && !columnToggle) return null

  return (
    <div className="mb-4 flex items-center gap-2">
      {showSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={searchValue ?? ''}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      )}

      {columnToggle && columns && onColumnVisibilityChange && (
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
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                className="capitalize"
                checked={col.isVisible}
                onCheckedChange={(v) => onColumnVisibilityChange(col.id, !!v)}
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
