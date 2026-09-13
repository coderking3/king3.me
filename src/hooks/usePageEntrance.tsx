'use client'

import type { ReactNode } from 'react'

import * as React from 'react'

interface PageEntranceState {
  entranceKey: number
  shouldAnimateOnMount: boolean
}

const PageEntranceContext = React.createContext<PageEntranceState | null>(null)

let hasHydrated = false

export function PageEntranceProvider({ children }: { children: ReactNode }) {
  const [entranceKey, setEntranceKey] = React.useState(() =>
    hasHydrated ? 1 : 0
  )
  const hasActivatedRef = React.useRef(false)

  React.useLayoutEffect(() => {
    if (hasActivatedRef.current) {
      setEntranceKey((currentKey) => currentKey + 1)
      return
    }

    hasActivatedRef.current = true
    hasHydrated = true
  }, [])

  const value = React.useMemo(
    () => ({
      entranceKey,
      shouldAnimateOnMount: entranceKey > 0
    }),
    [entranceKey]
  )

  return <PageEntranceContext value={value}>{children}</PageEntranceContext>
}

export function usePageEntrance() {
  const context = React.use(PageEntranceContext)

  if (!context) {
    throw new Error('usePageEntrance must be used within PageEntranceProvider')
  }

  return context
}
