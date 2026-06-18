import { Skeleton } from '@/components/ui/skeleton'

function UsePageSkeleton() {
  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:pr-0 sm:pl-12">
        <header className="max-w-2xl space-y-6">
          <Skeleton className="h-10 w-48 sm:h-14" />
          <Skeleton className="h-7 w-full max-w-lg" />
        </header>

        <div className="relative mt-12 flex justify-between gap-12 sm:mt-20">
          {/* Center - Content */}
          <div className="w-full max-w-3xl min-w-0 space-y-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[92%]" />
            <Skeleton className="h-5 w-[96%]" />
            <Skeleton className="h-5 w-[88%]" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[94%]" />
            <Skeleton className="h-5 w-[90%]" />
            <Skeleton className="h-5 w-[95%]" />
          </div>

          {/* Right - Table of contents */}
          <aside className="hidden w-48 shrink-0 pl-2 xl:block">
            <div className="sticky top-24 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default UsePageSkeleton
