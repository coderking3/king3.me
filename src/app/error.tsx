'use client'

import { ErrorView } from '@/views/error'

interface ErrorPageProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  return <ErrorView error={error} unstable_retry={unstable_retry} />
}
