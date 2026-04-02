'use client'

import type { InteractiveIconProps, SvgIcon } from '@/icons'

import { useEffect, useRef, useState } from 'react'

import { useThemeToggle } from '@/hooks'
import { InteractiveIcon, SunMoonIcon } from '@/icons'

export function ThemeMode({
  // Icon props
  size,
  color,
  strokeWidth,
  enterAnimationDelay = 0,
  // Interactive props
  ...delegated
}: InteractiveIconProps<
  SvgIcon & {
    enterAnimationDelay?: number
  }
>) {
  const { theme, toggleTheme } = useThemeToggle()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const timeoutId = useRef<number | undefined>(undefined)

  useEffect(() => setMounted(true), [])

  const onTrigger = (event: React.MouseEvent<any>) => {
    event.preventDefault()

    toggleTheme()
    setIsTransitioning(true)

    window.clearTimeout(timeoutId.current)
    timeoutId.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  // Avoid hydration mismatch: theme is unknown on the server,
  // so defer rendering until after mount.
  if (!mounted) {
    return (
      <InteractiveIcon {...delegated} trigger="hover">
        {() => (
          <SunMoonIcon
            isDark={false}
            {...{
              size,
              color,
              strokeWidth,
              isHovered: false,
              isTransitioning: false,
              includeEnterAnimation: false,
              enterAnimationDelay
            }}
          />
        )}
      </InteractiveIcon>
    )
  }

  const isDark = theme === 'dark'

  return (
    <InteractiveIcon
      {...delegated}
      alt={`Activate ${isDark ? 'light' : 'dark'} mode`}
      trigger="hover"
      onClick={onTrigger}
    >
      {({ isHovered }) => (
        <SunMoonIcon
          isDark={isDark}
          {...{
            size,
            color,
            strokeWidth,
            isHovered,
            isTransitioning,
            includeEnterAnimation: true,
            enterAnimationDelay
          }}
        />
      )}
    </InteractiveIcon>
  )
}
