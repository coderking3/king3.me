'use client'

import type {
  ExpandedState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import type { ExpandMode } from './components/SortableTableRow'
import type { ColumnVisibilityItem, DataTableProps } from './types'

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  DraggableTable,
  TableContent,
  TablePagination,
  TableToolbar
} from './components'
import {
  buildColumnDefs,
  buildGetRowId,
  resolveDefaultExpanded,
  resolvePaginationState
} from './utils'

/* --- Row model factories (module-level singletons) --- */

const coreRowModel = getCoreRowModel()
const filteredRowModel = getFilteredRowModel()
const sortedRowModel = getSortedRowModel()
const paginationRowModel = getPaginationRowModel()
const expandedRowModel = getExpandedRowModel()

/* --- Tailwind table padding classes --- */

const firstColPl = '[&_th:first-child]:pl-4 [&_td:first-child]:pl-4'
const firstColPr = '[&_th:first-child]:pr-1 [&_td:first-child]:pr-1'
const lastColPr = '[&_th:last-child]:pr-4 [&_td:last-child]:pr-4'

/* --- DataTable --- */

export function DataTable<T extends object>({
  columns: columnConfigs,
  data,
  rowKey,
  pagination,
  actions,
  selectable = false,
  tableRef,
  emptyText = 'No results.',
  loading,
  wrapClassName,
  className,
  toolbar,
  expandable,
  dragSort
}: DataTableProps<T>) {
  const enablePagination = !!pagination
  const enableClientFilter = !!toolbar && toolbar.filterMode !== 'manual'
  const expandMode: ExpandMode = expandable?.render
    ? 'panel'
    : expandable?.getChildren
      ? 'tree'
      : null
  const enableExpandable = !!expandable && !!expandMode
  const indentSize = expandable?.indentSize ?? 20
  const enableDragSort = !!dragSort?.enabled
  const dragHandle = dragSort?.handle ?? true

  /* --- State --- */

  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    resolvePaginationState(pagination)
  )
  const [expanded, setExpanded] = useState<ExpandedState>(() =>
    resolveDefaultExpanded(expandable?.defaultExpanded)
  )

  /* --- Derived --- */

  const getRowId = useMemo(() => buildGetRowId(rowKey), [rowKey])

  if (enableDragSort && !getRowId) {
    throw new Error('DataTable dragSort requires a stable rowKey.')
  }

  const dragDisabled =
    !enableDragSort ||
    !!dragSort?.disabled ||
    !!sorting.length ||
    loading === true ||
    data.length < 2

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const actionsRef = useRef(actions)
  actionsRef.current = actions

  const showDragHandleColumn = enableDragSort && dragHandle

  const columns = useMemo(
    () =>
      buildColumnDefs(
        columnConfigs,
        selectable,
        actionsRef.current,
        expandable,
        showDragHandleColumn
      ),
    // prettier-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columnConfigs.map((c) => ({ key: c.key, sortable: c.sortable }))), selectable, expandable, showDragHandleColumn]
  )

  const dataIds = useMemo(
    () =>
      data.map((record, index) => getRowId?.(record, index) ?? String(index)),
    [data, getRowId]
  )

  /* --- Table instance --- */

  const table = useReactTable<T>({
    data,
    columns,
    getRowId,
    getSubRows:
      expandMode === 'tree'
        ? (row) => expandable!.getChildren!(row) ?? []
        : undefined,
    getRowCanExpand: expandMode === 'panel' ? () => true : undefined,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      expanded,
      ...(enablePagination && { pagination: paginationState })
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableExpandable && { onExpandedChange: setExpanded }),
    getCoreRowModel: coreRowModel,
    ...(enableClientFilter && { getFilteredRowModel: filteredRowModel }),
    getSortedRowModel: sortedRowModel,
    ...(enableExpandable && { getExpandedRowModel: expandedRowModel }),
    ...(enablePagination && {
      getPaginationRowModel: paginationRowModel,
      onPaginationChange: setPaginationState
    })
  })

  useEffect(() => {
    if (tableRef) tableRef.current = table
  }, [table, tableRef])

  const columnVisibilities = useMemo<ColumnVisibilityItem[]>(
    () =>
      table
        .getAllColumns()
        .filter((col) => col.getCanHide())
        .map((col) => ({
          id: col.id,
          label:
            typeof col.columnDef.header === 'string'
              ? col.columnDef.header
              : col.id,
          isVisible: col.getIsVisible()
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnVisibility, columns]
  )

  /* --- Drag handler --- */

  const handleDragEnd = (
    event: Parameters<typeof DraggableTable>[0]['onDragEnd'] extends (
      e: infer E
    ) => any
      ? E
      : never
  ) => {
    if (!enableDragSort || dragDisabled || !dragSort?.onDragEnd) return

    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = dataIds.indexOf(String(active.id))
    const newIndex = dataIds.indexOf(String(over.id))
    if (oldIndex < 0 || newIndex < 0) return

    const dragResult = dragSort.onDragEnd(arrayMove(data, oldIndex, newIndex), {
      activeId: String(active.id),
      overId: String(over.id)
    })

    if (dragResult instanceof Promise) {
      dragResult.catch(() => undefined)
    }
  }

  /* --- Extract data from table (avoid passing table instance to children) --- */

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()
  const canPreviousPage = table.getCanPreviousPage()
  const canNextPage = table.getCanNextPage()

  /* --- Render --- */

  const tableContent = (
    <TableContent
      headerGroups={headerGroups}
      rows={rows}
      columns={columns}
      loading={loading}
      emptyText={emptyText}
      enableDragSort={enableDragSort}
      dragDisabled={dragDisabled}
      dragHandle={dragHandle}
      enableExpandable={enableExpandable}
      expandMode={expandMode}
      indentSize={indentSize}
      expandable={expandable}
    />
  )

  return (
    <div className={wrapClassName}>
      {toolbar && (
        <TableToolbar
          filterFields={toolbar.filterFields}
          filterMode={toolbar.filterMode}
          onFilter={toolbar.onFilter}
          setColumnFilterValue={(columnId, value) =>
            table.getColumn(columnId)?.setFilterValue(value)
          }
          actions={toolbar.actions}
          columnToggle={toolbar.columnToggle}
          columnVisibilities={columnVisibilities}
          onColumnVisibilityChange={(id, visible) =>
            table.getColumn(id)?.toggleVisibility(visible)
          }
        />
      )}

      <div
        className={cn(
          'overflow-hidden rounded-md border',
          firstColPl,
          selectable && firstColPr,
          !actions && lastColPr,
          className
        )}
      >
        {enableDragSort ? (
          <DraggableTable sensors={sensors} onDragEnd={handleDragEnd}>
            {tableContent}
          </DraggableTable>
        ) : (
          tableContent
        )}
      </div>

      {enablePagination && (
        <TablePagination
          pageIndex={paginationState.pageIndex}
          pageSize={paginationState.pageSize}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          onPageIndexChange={table.setPageIndex}
          onPageSizeChange={table.setPageSize}
          onPreviousPage={table.previousPage}
          onNextPage={table.nextPage}
        />
      )}
    </div>
  )
}
