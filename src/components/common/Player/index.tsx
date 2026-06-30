'use client'

import dynamic from 'next/dynamic'

import { useIsMobile } from '@/hooks'

const PlayerDynamic = dynamic(() => import('./Player'), { ssr: false })

export function Player() {
  const isMobile = useIsMobile()

  if (isMobile) return null

  return <PlayerDynamic />
}
