'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { copyToClipboard } from '@/lib/utils'

export function useCopyToClipboard(duration = 1500) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        await copyToClipboard(text)
        setCopied(true)

        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = window.setTimeout(() => {
          setCopied(false)
        }, duration)
      } catch (error) {
        console.error('Copy to clipboard failed:', error)
        setCopied(false) // Reset state on failure
      }
    },
    [duration]
  )

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { copied, copy }
}
