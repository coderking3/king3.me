import type { Easing } from 'framer-motion'

import type { PresetOption } from './types'

import type { MotionOptions } from '@/types'

const DEFAULT_EASE: Easing = [0.22, 1, 0.36, 1]
const DEFAULT_DURATION = 0.5

export const presetConfigs = {
  fadeIn: {},
  fadeInUp: { y: 20 },
  fadeInDown: { y: -20 },
  slideInLeft: { x: -30 },
  slideInRight: { x: 30 }
} as const

export function resolvePreset(preset: PresetOption): MotionOptions {
  const mode = typeof preset === 'string' ? preset : preset.mode
  const params =
    typeof preset === 'string'
      ? ({} as Record<string, unknown>)
      : (preset as unknown as Record<string, unknown>)
  const config = presetConfigs[mode]

  const delay = typeof params.delay === 'number' ? params.delay : 0
  const duration =
    typeof params.duration === 'number' ? params.duration : DEFAULT_DURATION
  const ease = (params.ease as Easing) || DEFAULT_EASE

  const initial: Record<string, number> = { opacity: 0 }
  const animate: Record<string, number> = { opacity: 1 }

  for (const [key, defaultValue] of Object.entries(config) as [
    string,
    number
  ][]) {
    const customValue =
      typeof params[key] === 'number' ? (params[key] as number) : undefined
    initial[key] = customValue ?? defaultValue
    animate[key] = 0
  }

  return {
    initial,
    animate,
    transition: { duration, delay, ease }
  }
}
