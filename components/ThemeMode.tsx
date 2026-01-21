// import type { InteractiveIconProps, SvgIcon } from '@/icons'

import type { InteractiveIconProps, SvgIcon } from '@/icons'

import { useRef, useState } from 'react'

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
  const [isTransitioning, setIsTransitioning] = useState(false)

  const timeoutId = useRef<number | undefined>(undefined)

  const onTrigger = (event: React.MouseEvent<any>) => {
    event.preventDefault()

    toggleTheme()
    setIsTransitioning(true)

    window.clearTimeout(timeoutId.current)
    timeoutId.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <InteractiveIcon
      {...delegated}
      alt={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      trigger="hover"
      onClick={onTrigger}
    >
      {({ isHovered }) => (
        <SunMoonIcon
          isDark={theme === 'dark'}
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
