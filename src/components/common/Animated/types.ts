import type { Easing } from 'framer-motion'

import type { presetConfigs } from './presets'

export type PresetMode = keyof typeof presetConfigs

export interface TransitionParams {
  delay?: number
  duration?: number
  ease?: Easing
}

export interface SlideXParams extends TransitionParams {
  x?: number
}

export interface FadeYParams extends TransitionParams {
  y?: number
}

export interface PresetParamsMap {
  fadeIn: TransitionParams
  fadeInUp: FadeYParams
  fadeInDown: FadeYParams
  slideInLeft: SlideXParams
  slideInRight: SlideXParams
}

export type PresetOption =
  | PresetMode
  | { [K in PresetMode]: { mode: K } & PresetParamsMap[K] }[PresetMode]
