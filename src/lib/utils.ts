import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
