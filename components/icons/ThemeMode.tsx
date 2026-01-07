'use client'

import type { Transition } from 'framer-motion'

import type { IconInteractiveProps } from './Interactive'

import type { MotionOptions, SvgIcon } from '@/types'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { useRef, useState } from 'react'

import { MOTION_SPRINGS } from '@/constants'
import { range, roundTo } from '@/lib/utils'

import Interactive from './Interactive'

const SUN_RADIUS = 6
const MOON_RADIUS = 9.5
const SUN_DOTS_RADIUS = 12

const NUM_OF_DOTS = 8
const SUN_DOTS_DELAY = 0.15
const SUN_DOTS_STAGGER = 0.08

interface SunMoonIconProps extends SvgIcon {
  isDark: boolean
  isBooped?: boolean
  isTransitioning?: boolean
}

export function SunMoonIcon({
  isDark,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isBooped = false,
  isTransitioning = false
}: SunMoonIconProps) {
  const id = React.useId().replace(/:/g, '')

  const defaultSpring: Transition = {
    type: 'spring',
    stiffness: 160,
    damping: 30
  }

  /* Derived */

  const rotation = isDark ? (isBooped ? 28 : 40) : 90

  const sunMoonRadius = isDark
    ? MOON_RADIUS
    : isBooped
      ? SUN_RADIUS - 2
      : SUN_RADIUS

  const sunMaskRadius = isDark ? MOON_RADIUS + 1 : SUN_RADIUS + 1

  const hypotenuse = isBooped ? 9 : 10
  const sunDots = React.useMemo(
    () =>
      range(NUM_OF_DOTS).map((_, index) => {
        const angle = index * (360 / NUM_OF_DOTS)
        const rad = (angle * Math.PI) / 180

        return {
          key: angle,
          cx: roundTo(SUN_DOTS_RADIUS + hypotenuse * Math.cos(rad)),
          cy: roundTo(SUN_DOTS_RADIUS + hypotenuse * Math.sin(rad)),
          delay: SUN_DOTS_DELAY + index * SUN_DOTS_STAGGER
        }
      }),
    [hypotenuse]
  )

  /* Motions */

  const iconMotion: MotionOptions = {
    animate: { rotate: rotation },
    transition: isTransitioning ? defaultSpring : MOTION_SPRINGS.springy
  }

  const sunMoonCircleMotion: MotionOptions = {
    animate: { r: sunMoonRadius },
    transition:
      isBooped && !isTransitioning
        ? { type: 'spring', stiffness: 300, damping: 20 }
        : defaultSpring
  }

  const moonCrescentMotion: MotionOptions = {
    animate: { cy: isDark ? 4 : -4 },
    transition: defaultSpring
  }

  const moonCrescentMaskMotion: MotionOptions = {
    animate: { r: sunMaskRadius },
    transition: defaultSpring
  }

  const sunDotMotion = ({
    cx,
    cy,
    delay,
    isDark
  }: {
    cx: number
    cy: number
    delay: number
    isDark: boolean
  }): MotionOptions => {
    return {
      initial: { scale: 0 },
      animate: {
        cx,
        cy,
        scale: isDark ? 0 : 1
      },
      transition: {
        cx: MOTION_SPRINGS.springy,
        cy: MOTION_SPRINGS.springy,
        scale: isDark
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 16,
              delay
            }
      }
    }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="relative block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      strokeWidth={strokeWidth}
      {...iconMotion}
    >
      {/* Sun dots mask */}
      <mask id={`sun-dot-mask-${id}`}>
        <rect x="-10" y="-10" width="44" height="44" fill="#fff" />
        <circle cx="12" cy="12" r={SUN_RADIUS} fill="#000" />
      </mask>

      {/* Moon cutout mask */}
      <mask id={`moon-cutout-mask-${id}`}>
        <rect width="24" height="24" fill="#fff" />
        <motion.circle cx="12" r="8" fill="#000" {...moonCrescentMotion} />
      </mask>

      {/* Moon crescent mask */}
      <mask id={`moon-crescent-mask-${id}`}>
        <rect width="24" height="24" fill="#000" />
        <motion.circle
          cx="12"
          cy="12"
          fill="#fff"
          {...moonCrescentMaskMotion}
        />
      </mask>

      {/* Sun dots */}
      <g mask={`url(#sun-dot-mask-${id})`}>
        {sunDots.map(({ key, cx, cy, delay }) => (
          <motion.circle
            key={key}
            r={1.5}
            fill={color}
            {...sunDotMotion({ cx, cy, delay, isDark })}
          />
        ))}
      </g>

      {/* Sun / Moon body */}
      <g mask={`url(#moon-cutout-mask-${id})`}>
        <motion.circle
          cx="12"
          cy="12"
          stroke={color}
          fill="none"
          {...sunMoonCircleMotion}
        />
      </g>

      {/* Crescent */}
      <g mask={`url(#moon-crescent-mask-${id})`}>
        <motion.circle
          cx="12"
          r="8"
          stroke={color}
          fill="none"
          {...moonCrescentMotion}
        />
      </g>
    </motion.svg>
  )
}

export function ThemeMode({
  // Icon props
  size,
  color,
  strokeWidth,
  // Interactive props
  ...restProps
}: IconInteractiveProps) {
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
    <Interactive
      {...restProps}
      alt={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={onTrigger}
    >
      {({ isBooped }) => (
        <SunMoonIcon
          isDark={theme === 'dark'}
          {...{
            size,
            color,
            strokeWidth,
            isBooped,
            isTransitioning
          }}
        />
      )}
    </Interactive>
  )
}
