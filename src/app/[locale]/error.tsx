'use client'

import { ErrorPage } from '@/views/error'

interface ErrorProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function Error({ error, unstable_retry }: ErrorProps) {
  return <ErrorPage error={error} unstable_retry={unstable_retry} />
}
