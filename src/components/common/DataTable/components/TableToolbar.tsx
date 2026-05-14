'use client'

import type { ColumnVisibilityItem, ExportConfig, FilterField } from '../types'

import {
  ClipboardCopy,
  Download,
  FileDown,
  RotateCcw,
  Search,
  Settings2
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'

/* --- Types --- */

export interface TableToolbarProps {
  filterFields?: FilterField[]
  filterMode?: 'auto' | 'manual'
  onFilter?: (values: Record<string, string>) => void
  /** Set a column's filter value (for auto filter mode) */
  setColumnFilterValue?: (columnId: string, value: string | undefined) => void
  actions?: React.ReactNode
  columnToggle?: boolean
  columnVisibilities?: ColumnVisibilityItem[]
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void
  exportable?: boolean | ExportConfig
  data?: unknown[]
}

/* --- Helpers --- */

function buildEmptyValues(fields: FilterField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, '']))
}

const DefaultFilterFields: FilterField[] = []

/* --- Component --- */

export function TableToolbar({
  filterFields = DefaultFilterFields,
  filterMode = 'auto',
  onFilter,
  setColumnFilterValue,
  actions,
  columnToggle,
  columnVisibilities,
  onColumnVisibilityChange,
  exportable: exportConfig,
  data
}: TableToolbarProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildEmptyValues(filterFields)
  )

  const isAuto = filterMode === 'auto'
  const hasActiveFilters = Object.values(values).some(Boolean)
  const hasFilterFields = filterFields.length > 0

  const enableExport = !!exportConfig
  const exportFilename =
    (typeof exportConfig === 'object' ? exportConfig.filename : undefined) ??
    'export'

  const showRightSide = !!actions || columnToggle || enableExport
  const showToolbar = hasFilterFields || showRightSide

  if (!showToolbar) return null

  /* --- Handlers --- */

  const setValue = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }))

  const handleAutoChange = (key: string, value: string) => {
    setValue(key, value)
    setColumnFilterValue?.(key, value || undefined)
  }

  const handleAutoReset = () => {
    const empty = buildEmptyValues(filterFields)
    setValues(empty)
    filterFields.forEach((f) => setColumnFilterValue?.(f.key, undefined))
  }

  const handleManualQuery = () => onFilter?.(values)

  const handleManualReset = () => {
    const empty = buildEmptyValues(filterFields)
    setValues(empty)
    onFilter?.(empty)
  }

  const getExportJson = () => JSON.stringify(data ?? [], null, 2)

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(getExportJson())
      toast.success('JSON copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleDownloadJson = () => {
    const blob = new Blob([getExportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exportFilename}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* --- Render --- */

  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      {hasFilterFields && (
        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
          {filterFields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">
                {field.label}
              </Label>

              {field.type === 'select' ? (
                <Select
                  value={values[field.key] ?? ''}
                  onValueChange={(v) =>
                    isAuto
                      ? handleAutoChange(field.key, v ?? '')
                      : setValue(field.key, v ?? '')
                  }
                >
                  <SelectTrigger className="h-8 w-36 text-sm">
                    <SelectValue
                      placeholder={field.placeholder ?? `All ${field.label}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  className="h-8 w-40 text-sm"
                  placeholder={field.placeholder ?? `Search ${field.label}…`}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    isAuto
                      ? handleAutoChange(field.key, e.target.value)
                      : setValue(field.key, e.target.value)
                  }
                  onKeyDown={(e) =>
                    !isAuto && e.key === 'Enter' && handleManualQuery()
                  }
                />
              )}
            </div>
          ))}

          {!isAuto && (
            <Button size="sm" className="h-8" onClick={handleManualQuery}>
              <Search className="mr-1.5 h-3.5 w-3.5" />
              Query
            </Button>
          )}

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={isAuto ? handleAutoReset : handleManualReset}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      )}

      {showRightSide && (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {actions}

          {enableExport && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="h-8">
                    <FileDown className="mr-2 size-4" />
                    Export
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleCopyJson}>
                    <ClipboardCopy className="mr-2 size-4" />
                    Copy JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadJson}>
                    <Download className="mr-2 size-4" />
                    Download JSON
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {columnToggle &&
            columnVisibilities &&
            columnVisibilities.length > 0 &&
            onColumnVisibilityChange && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings2 className="mr-2 size-4" />
                      View
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columnVisibilities.map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        className="capitalize"
                        checked={col.isVisible}
                        onCheckedChange={(v) =>
                          onColumnVisibilityChange(col.id, !!v)
                        }
                      >
                        {col.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      )}
    </div>
  )
}
