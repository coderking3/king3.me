import type { ClassValue } from 'clsx'

import process from 'node:process'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/* Classname */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Env */

export const isProduction = () => process.env.NODE_ENV === 'production'

/* Copy */
export async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
