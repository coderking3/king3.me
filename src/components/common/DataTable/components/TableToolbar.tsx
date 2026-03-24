'use client'

import type { Table } from '@tanstack/react-table'

import type { SearchableConfig } from '../types'

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

interface TableToolbarProps<T> {
  table: Table<T>
  searchConfig: (SearchableConfig & { filterKey: string }) | null
  columnToggle?: boolean
}

export function TableToolbar<T>({
  table,
  searchConfig,
  columnToggle
}: TableToolbarProps<T>) {
  if (!searchConfig && !columnToggle) return null

  return (
    <div className="mb-4 flex items-center gap-2">
      {searchConfig && (
        <Input
          placeholder={searchConfig.placeholder ?? 'Search...'}
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
  )
}
