import { Skeleton } from '@/components/ui'

function AuthPageSkeleton() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="from-background/70 to-background/90 border-border/70 dark:border-border shadow-muted-foreground/10 relative w-full max-w-sm rounded-2xl border bg-linear-to-b p-8 shadow-lg backdrop-blur-xs backdrop-saturate-150">
        {/* Back link */}
        <Skeleton className="absolute top-4 right-4.5 h-4 w-14" />

        {/* Logo */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Title */}
        <div className="mb-7 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <Skeleton className="h-3 w-24" />
          <div className="bg-border h-px flex-1" />
        </div>

        {/* Security notice */}
        <div className="bg-muted/40 border-border/40 flex items-center justify-center gap-2 rounded-lg border px-4 py-2">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-3.5 w-44" />
        </div>
      </div>
    </div>
  )
}

export default AuthPageSkeleton
