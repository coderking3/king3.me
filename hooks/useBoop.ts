import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useBoop(isTriggered: boolean, duration = 150) {
  const [isBooped, setIsBooped] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!isTriggered || prefersReducedMotion) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsBooped(true)
  }, [isTriggered, prefersReducedMotion])

  useEffect(() => {
    if (!isBooped) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsBooped(false)
    }, duration)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isBooped, duration])

  return isBooped
}
