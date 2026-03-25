'use client'

import type { FilterField } from '../types'

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

/** 由 TestDataTable 从 table 实例派生后传入，不需要调用方手动维护 */
export interface ColumnVisibilityItem {
  id: string
  /** 展示用名称，取自 ColumnConfig.title */
  label: string
  isVisible: boolean
}

export interface TableToolbarProps {
  /** 左侧筛选字段配置 */
  filterFields?: FilterField[]
  /** 点击 Query / Reset 时触发 */
  onFilter?: (values: Record<string, string>) => void

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
  onFilter,
  actions,
  columnToggle,
  columnVisibilities,
  onColumnVisibilityChange
}: TableToolbarProps) {
  console.log(`🚀 ~ columnVisibilities:`, columnVisibilities)
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildEmptyValues(filterFields)
  )

  // 任意字段有值时，Reset 按钮才高亮可用
  const hasActiveFilters = Object.values(values).some(Boolean)
  const hasFilterFields = filterFields.length > 0

  const showRightSide = !!actions || columnToggle
  console.log(`🚀 ~ columnToggle:`, columnToggle)
  const showToolbar = hasFilterFields || showRightSide

  if (!showToolbar) return null

  // ── handlers ──────────────────────────────────────────────────

  const setValue = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }))

  const handleQuery = () => onFilter?.(values)

  const handleReset = () => {
    const empty = buildEmptyValues(filterFields)
    setValues(empty)
    onFilter?.(empty)
  }

  // ── render ────────────────────────────────────────────────────

  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      {/* ── Left: filter fields + Query / Reset ── */}
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
                  onValueChange={(v) => setValue(field.key, v ?? '')}
                >
                  <SelectTrigger className="h-8 w-36 text-sm">
                    <SelectValue
                      placeholder={field.placeholder ?? `All ${field.label}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 空选项：清除该字段的筛选 */}
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
                  onChange={(e) => setValue(field.key, e.target.value)}
                  // 支持回车直接触发查询
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                />
              )}
            </div>
          ))}

          {/* Query */}
          <Button size="sm" className="h-8" onClick={handleQuery}>
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Query
          </Button>

          {/* Reset：只有存在活跃筛选时才显示，避免界面常驻一个无意义的按钮 */}
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={handleReset}
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
          {/* 调用方自定义按钮区域：新增、导出等 */}
          {actions}

          {/* 列显隐 */}
          {columnToggle &&
            columnVisibilities &&
            columnVisibilities.length > 0 &&
            onColumnVisibilityChange && (
              <DropdownMenu>
                {/* <DropdownMenuTrigger asChild>
                  
                </DropdownMenuTrigger> */}
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
