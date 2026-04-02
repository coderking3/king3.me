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

import type { ExpandMode } from './components'
import type { DataTableProps } from './types'

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
import { css } from '@linaria/core'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Fragment, useMemo, useRef, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'
import { cn } from '@/lib/utils'

import { SortableTableRow, TablePagination, TableToolbar } from './components'
import {
  buildColumnDefs,
  buildGetRowId,
  resolveDefaultExpanded,
  resolvePaginationState
} from './utils'

/* --- Styles --- */

const firstColPadding = css`
  & th:first-child,
  & td:first-child {
    padding-left: 1rem;
  }
`
const firstColPaddingRight = css`
  & th:first-child,
  & td:first-child {
    padding-right: 0.25rem;
  }
`
const lastColPadding = css`
  & th:last-child,
  & td:last-child {
    padding-right: 1rem;
  }
`

/* --- Row model factories (module-level singletons) --- */

const coreRowModel = getCoreRowModel()
const filteredRowModel = getFilteredRowModel()
const sortedRowModel = getSortedRowModel()
const paginationRowModel = getPaginationRowModel()
const expandedRowModel = getExpandedRowModel()

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

  if (tableRef) {
    tableRef.current = table
  }

  const columnVisibilities = useMemo(
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

  const dndRowIds = table.getRowModel().rows.map((row) => row.id)

  /* --- Row renderer --- */

  const renderStaticRow = (row: Row<T>) => {
    const firstContentCellIndex = row
      .getVisibleCells()
      .findIndex(
        (cell) =>
          cell.column.id !== 'select' &&
          cell.column.id !== 'drag' &&
          cell.column.id !== 'expand'
      )

    return (
      <Fragment key={row.id}>
        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
          {row.getVisibleCells().map((cell, cellIndex) => {
            const isFirstContentCell =
              enableExpandable && cellIndex === firstContentCellIndex
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

  const bodyContent = loading ? (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="text-muted-foreground h-64 text-center"
      >
        Loading...
      </TableCell>
    </TableRow>
  ) : table.getRowModel().rows.length ? (
    enableDragSort ? (
      <SortableContext items={dndRowIds} strategy={verticalListSortingStrategy}>
        {table.getRowModel().rows.map((row) => (
          <SortableTableRow
            key={row.id}
            row={row}
            dragHandle={dragHandle}
            dragDisabled={dragDisabled}
            enableExpandable={enableExpandable}
            expandMode={expandMode}
            indentSize={indentSize}
            expandable={expandable}
          />
        ))}
      </SortableContext>
    ) : (
      table.getRowModel().rows.map((row) => renderStaticRow(row))
    )
  ) : (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="text-muted-foreground h-64 text-center"
      >
        {emptyText}
      </TableCell>
    </TableRow>
  )

  const tableContent = (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
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

  return (
    <div className={wrapClassName}>
      {toolbar && (
        <TableToolbar
          filterFields={toolbar.filterFields}
          filterMode={toolbar.filterMode}
          onFilter={toolbar.onFilter}
          table={table}
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
          firstColPadding,
          selectable && firstColPaddingRight,
          !actions && lastColPadding,
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
