import { useTheme } from 'next-themes'
import { useRef, useState } from 'react'

import { IconWrapper, SunMoon } from './icons'

interface ToggleThemeModeProps extends React.HTMLAttributes<HTMLAnchorElement> {
  size?: number
}
function ThemeMode({ size = 20, ...delegated }: ToggleThemeModeProps) {
  const { theme, setTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const timeoutId = useRef<number | undefined>(undefined)

  const onTrigger = (event: React.MouseEvent<any>) => {
    event.preventDefault()
    const isDark = theme === 'dark'

    setTheme(isDark ? 'light' : 'dark')
    setIsTransitioning(true)

    window.clearTimeout(timeoutId.current)
    timeoutId.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <IconWrapper
      alt={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      {...delegated}
      onClick={onTrigger}
    >
      {({ isBooped }) => (
        <SunMoon
          isDark={theme === 'dark'}
          size={size}
          isBooped={isBooped}
          isTransitioning={isTransitioning}
        />
      )}
    </IconWrapper>
  )
}

export default ThemeMode
