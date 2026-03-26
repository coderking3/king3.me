'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnVisibilityItem, FilterField } from '../types'

import { RotateCcw, Search, Settings2 } from 'lucide-react'
import { useState } from 'react'

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
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

// ── Types ──────────────────────────────────────────────────────────

export interface TableToolbarProps {
  /** 左侧筛选字段配置 */
  filterFields?: FilterField[]
  /** 筛选模式，默认 'auto' */
  filterMode?: 'auto' | 'manual'
  /** manual 模式下点击 Query / Reset 时触发 */
  onFilter?: (values: Record<string, string>) => void
  /** TanStack Table 实例，auto 模式下用于 column.setFilterValue */
  table?: Table<any>

  /** 右侧自定义操作区（新增、导出等业务按钮） */
  actions?: React.ReactNode

  /** 列显隐 Dropdown */
  columnToggle?: boolean
  columnVisibilities?: ColumnVisibilityItem[]
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void
}

// ── Helpers ────────────────────────────────────────────────────────

function buildEmptyValues(fields: FilterField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, '']))
}

// ── Component ──────────────────────────────────────────────────────

const DefaultFilterFields: FilterField[] = []

export function TableToolbar({
  filterFields = DefaultFilterFields,
  filterMode = 'auto',
  onFilter,
  table,
  actions,
  columnToggle,
  columnVisibilities,
  onColumnVisibilityChange
}: TableToolbarProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildEmptyValues(filterFields)
  )

  const isAuto = filterMode === 'auto'
  const hasActiveFilters = Object.values(values).some(Boolean)
  const hasFilterFields = filterFields.length > 0

  const showRightSide = !!actions || columnToggle
  const showToolbar = hasFilterFields || showRightSide

  if (!showToolbar) return null

  // ── handlers ──────────────────────────────────────────────────

  const setValue = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }))

  // auto 模式：输入即筛选
  const handleAutoChange = (key: string, value: string) => {
    setValue(key, value)
    table?.getColumn(key)?.setFilterValue(value || undefined)
  }

  const handleAutoReset = () => {
    const empty = buildEmptyValues(filterFields)
    setValues(empty)
    filterFields.forEach((f) =>
      table?.getColumn(f.key)?.setFilterValue(undefined)
    )
  }

  // manual 模式：点击 Query 触发
  const handleManualQuery = () => onFilter?.(values)

  const handleManualReset = () => {
    const empty = buildEmptyValues(filterFields)
    setValues(empty)
    onFilter?.(empty)
  }

  // ── render ────────────────────────────────────────────────────

  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      {/* ── Left: filter fields ── */}
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

          {/* manual 模式：Query 按钮 */}
          {!isAuto && (
            <Button size="sm" className="h-8" onClick={handleManualQuery}>
              <Search className="mr-1.5 h-3.5 w-3.5" />
              Query
            </Button>
          )}

          {/* Reset 按钮：有活跃筛选时显示 */}
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

      {/* ── Right: custom actions + column toggle ── */}
      {showRightSide && (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {actions}

          {columnToggle &&
            columnVisibilities &&
            columnVisibilities.length > 0 &&
            onColumnVisibilityChange && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings2 className="mr-2 h-4 w-4" />
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
