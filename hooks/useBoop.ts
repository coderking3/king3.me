import * as React from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useBoop(isEngaged: boolean, timing = 150) {
  const [isBooped, setIsBooped] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (!isEngaged || prefersReducedMotion) {
      return
    }

    setIsBooped(true)
  }, [isEngaged, prefersReducedMotion])

  React.useEffect(() => {
    if (!isBooped) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsBooped(false)
    }, timing)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isBooped, timing])

  return isBooped
}
