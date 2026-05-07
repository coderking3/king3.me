import type { ActionResult } from '@/types'

import process from 'node:process'

export function actionSuccess<T = any>(data: T): ActionResult<T> {
  return {
    success: true,
    data,
    message: 'ok'
  }
}

export function actionError(error: any = null): ActionResult<never> {
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
