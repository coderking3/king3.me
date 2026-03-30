'use client'

import {
  Button,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { cn } from '@/lib/utils'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50] as const

export interface PaginationProps {
  pageIndex: number
  pageSize: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPageIndexChange: (index: number) => void
  onPageSizeChange: (size: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

/* --- Helpers --- */

/** Generate visible page numbers (0-based) with a sliding window of 3. */
function getVisiblePages(
  pageIndex: number,
  pageCount: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, i) => i)
  }

  let start = pageIndex - 1
  let end = pageIndex + 1

  if (start < 0) {
    start = 0
    end = 2
  }
  if (end >= pageCount) {
    end = pageCount - 1
    start = pageCount - 3
  }

  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []

  if (start > 0) pages.push('ellipsis-start')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < pageCount - 1) pages.push('ellipsis-end')

  return pages
}

/* --- Component --- */

export function TablePagination({
  pageIndex,
  pageSize,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPageIndexChange,
  onPageSizeChange,
  onPreviousPage,
  onNextPage
}: PaginationProps) {
  const visiblePages = getVisiblePages(pageIndex, pageCount)

  return (
    <div className="flex items-center justify-end gap-4 py-4">
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={canPreviousPage ? onPreviousPage : undefined}
              aria-disabled={!canPreviousPage}
              className={cn(
                !canPreviousPage && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>

          {visiblePages.map((item) => {
            if (typeof item === 'string') {
              return (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            const isActive = item === pageIndex
            return (
              <PaginationItem key={item}>
                <Button
                  variant={isActive ? 'outline' : 'ghost'}
                  size="icon"
                  className={cn('size-8', isActive && 'pointer-events-none')}
                  onClick={() => onPageIndexChange(item)}
                  aria-label={`Go to page ${item + 1}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item + 1}
                </Button>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              onClick={canNextPage ? onNextPage : undefined}
              aria-disabled={!canNextPage}
              className={cn(!canNextPage && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Select
        value={String(pageSize)}
        onValueChange={(v) => onPageSizeChange(Number(v))}
      >
        <SelectTrigger className="h-8 w-auto gap-1 shadow-none dark:border-transparent">
          <SelectValue>{pageSize} / page</SelectValue>
        </SelectTrigger>
        <SelectContent side="top">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
