import type { ActionResult } from '@/types'

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function actionError(error: unknown): ActionResult<never> {
  const message = error instanceof Error ? error.message : 'Operation failed'
  return { success: false, error: message }
}
