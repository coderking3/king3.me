import type { motion, MotionNodeAnimationOptions } from 'framer-motion'

export type MotionOptions = MotionNodeAnimationOptions
export type MotionElement = keyof typeof motion

export interface TocItem {
  id: string
  text: string
  level: number
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
