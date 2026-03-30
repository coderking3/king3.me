'use client'

import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { flushSync } from 'react-dom'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useThemeToggle() {
  const { theme, setTheme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()

  const toggleTheme = useCallback(() => {
    const isAppearanceTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !prefersReducedMotion

    const newTheme = theme === 'dark' ? 'light' : 'dark'

    if (!isAppearanceTransition) {
      setTheme(newTheme)
      return
    }

    // flushSync ensures React commits DOM changes before View Transition captures the snapshot
    document.startViewTransition(() => {
      // eslint-disable-next-line react-dom/no-flush-sync
      flushSync(() => {
        setTheme(newTheme)
      })
    })
  }, [theme, setTheme, prefersReducedMotion])

  return { theme, toggleTheme }
}
