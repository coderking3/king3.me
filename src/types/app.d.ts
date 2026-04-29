import type { motion, MotionNodeAnimationOptions } from 'framer-motion'

export type MotionOptions = MotionNodeAnimationOptions
export type MotionElement = keyof typeof motion

export interface TocItem {
  id: string
  text: string
  level: number
}

export type ActionResult<T = any> =
  | { success: true; data: T; error: null; message: string }
  | { success: false; data: null; error: string; message: string }
