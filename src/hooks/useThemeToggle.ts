'use client'

import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { flushSync } from 'react-dom'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useThemeToggle() {
  const { theme, setTheme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()

  const toggleTheme = useCallback(() => {
    // 检查浏览器支持及用户偏好
    const isAppearanceTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !prefersReducedMotion

    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // 不支持时直接切换
    if (!isAppearanceTransition) {
      setTheme(newTheme)
      return
    }

    // 使用 View Transition API 包装状态变更
    document.startViewTransition(() => {
      // 使用 flushSync 强制 React 立即更新 DOM 状态
      // 这样 View Transition 才能捕捉到正确的“新状态”快照
      // eslint-disable-next-line react-dom/no-flush-sync
      flushSync(() => {
        setTheme(newTheme)
      })
    })
  }, [theme, setTheme, prefersReducedMotion])

  return { theme, toggleTheme }
}
