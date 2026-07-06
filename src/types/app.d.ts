import type { motion, MotionNodeAnimationOptions } from 'framer-motion'

export type MotionOptions = MotionNodeAnimationOptions
export type MotionElement = keyof typeof motion

export interface TocItem {
  id: string
  text: string
  level: number
}

export type ResponseResult<T = any> =
  | { success: true; data: T; message: string }
  | { success: false; data: null; message: string }

/** A single gallery image entry */
export interface GalleryItem {
  /** Display name / caption for this image, reserved for future use — currently empty */
  name: string
  /** Image source url */
  url: string
}
