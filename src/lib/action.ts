import type { ActionResult } from '@/types'

export function actionSuccess<T = any>(data: T): ActionResult<T> {
  return {
    success: true,
    data,
    error: null,
    message: 'ok'
  }
}

export function actionError(error: any = null): ActionResult<never> {
  const message = error instanceof Error ? error.message : 'Unknown error'

  return {
    success: false,
    data: null,
    error,
    message
  }
}
