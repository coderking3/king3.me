'use client'
import { useTheme } from 'next-themes'

import { SunAndMoon } from './icons'
import { Button } from './ui'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      className="text-foreground flex size-8 items-center justify-center bg-transparent p-0 hover:bg-transparent"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <SunAndMoon isLight={theme !== 'dark'} className="size-6"></SunAndMoon>
    </Button>
  )
}

export default ThemeToggle
