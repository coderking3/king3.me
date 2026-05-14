import type { ResponseResult } from '@/types'

import process from 'node:process'

export function success<T = any>(data: T): ResponseResult<T> {
  return {
    success: true,
    data,
    message: 'ok'
  }
}

export function failure(error: any = null): ResponseResult<never> {
  // Log the detailed error server-side (but not to console in production)
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Action Error]', error)
  }

  const message = error instanceof Error ? error.message : 'Unknown error'

  return {
    success: false,
    data: null,
    message
  }
}
