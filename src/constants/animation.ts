import type { SpringConfig } from '@react-spring/web'

export const SPRINGS: Record<'springy', SpringConfig> = {
  springy: {
    /* Spring stiffness. Higher values produce more vigorous motion. Default: 100. */
    tension: 300,
    /* Damping force. If set to 0, the spring will oscillate indefinitely. Default: 10. */
    friction: 10
  }
}

export const STAGGER = {
  base: 0.12,
  step: 0.04
} as const
