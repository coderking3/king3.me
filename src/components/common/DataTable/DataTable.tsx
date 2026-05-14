'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import type {
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import type { ColumnVisibilityItem, DataTableProps, ExpandMode } from './types'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'
import { cn } from '@/lib/utils'

import { TablePagination, TableSortableRow, TableToolbar } from './components'
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
  onRowSelectionChange: onRowSelectionChangeProp,
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
    // eslint-disable-next-line react/exhaustive-deps
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

  useEffect(() => {
    if (onRowSelectionChangeProp) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
      onRowSelectionChangeProp(selectedRows)
    }
  }, [rowSelection, onRowSelectionChangeProp, table])

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
    // eslint-disable-next-line react/exhaustive-deps
    [table, columnVisibility, columns]
  )

  /* --- Derived from table instance --- */

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const colSpan = columns.length

  /* --- Drag handler --- */

  const handleDragEnd = (event: DragEndEvent) => {
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

  /* --- Row renderer (inline, no component boundary) --- */

  const renderRow = (row: Row<T>) => {
    const firstContentCellIndex = enableExpandable
      ? row
          .getVisibleCells()
          .findIndex(
            (cell) =>
              cell.column.id !== 'select' &&
              cell.column.id !== 'drag' &&
              cell.column.id !== 'expand'
          )
      : -1

    return (
      <Fragment key={row.id}>
        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
          {row.getVisibleCells().map((cell, cellIndex) => {
            const isFirstContentCell = cellIndex === firstContentCellIndex
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
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

  /* --- Body content --- */

  const dndRowIds = rows.map((row) => row.id)

  const bodyContent = loading ? (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="text-muted-foreground h-64 text-center"
      >
        Loading...
      </TableCell>
    </TableRow>
  ) : rows.length ? (
    enableDragSort ? (
      <SortableContext items={dndRowIds} strategy={verticalListSortingStrategy}>
        {rows.map((row) => (
          <TableSortableRow
            key={row.id}
            row={row}
            dragHandle={dragHandle}
            dragDisabled={dragDisabled}
            enableExpandable={enableExpandable}
            expandMode={expandMode}
            indentSize={indentSize}
            expandable={expandable}
            isExpanded={row.getIsExpanded()}
            isSelected={row.getIsSelected()}
          />
        ))}
      </SortableContext>
    ) : (
      rows.map((row) => renderRow(row))
    )
  ) : (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="text-muted-foreground h-64 text-center"
      >
        {emptyText}
      </TableCell>
    </TableRow>
  )

  /* --- Table markup --- */

  const tableContent = (
    <Table>
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  header.column.columnDef.meta?.className,
                  header.column.columnDef.meta?.headClassName
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>{bodyContent}</TableBody>
    </Table>
  )

  /* --- Render --- */

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
          exportable={toolbar.exportable}
          data={data}
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
          <DndContext
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            {tableContent}
          </DndContext>
        ) : (
          tableContent
        )}
      </div>

      {enablePagination && (
        <TablePagination
          pageIndex={paginationState.pageIndex}
          pageSize={paginationState.pageSize}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onPageIndexChange={table.setPageIndex}
          onPageSizeChange={table.setPageSize}
          onPreviousPage={table.previousPage}
          onNextPage={table.nextPage}
        />
      )}
    </div>
  )
}
