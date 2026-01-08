'use client'

import type { SpringConfig } from '@react-spring/web'

import type { IconInteractiveProps } from './Interactive'

import type { SvgIcon } from '@/types'

import { styled } from '@linaria/react'
import { animated, useSpring, useTrail } from '@react-spring/web'
import { useId, useRef, useState } from 'react'

import { SPRINGS } from '@/constants'
import { usePrefersReducedMotion, useThemeToggle } from '@/hooks'
import { range, roundTo } from '@/lib/utils'

import Interactive from './Interactive'

const SUN_RADIUS = 6
const MOON_RADIUS = 9.5

const NUM_OF_DOTS = 8
const SUN_DOTS_RADIUS = 12
const SUN_DOTS_ANIMARION_ANGLES = [180, 135, 225, 90, 270, 45, 315, 0]

const DEFAULT_CONFIG: SpringConfig = {
  tension: 160,
  friction: 30
}

interface BaseProps extends SvgIcon {
  enterAnimationDelay?: number
}

interface SunMoonIconProps extends BaseProps {
  isDark: boolean
  isBooped?: boolean
  isTransitioning?: boolean
  includeEnterAnimation: boolean
}

export function SunMoonIcon({
  isDark,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isBooped = false,
  isTransitioning = false,
  includeEnterAnimation,
  enterAnimationDelay = 0
}: SunMoonIconProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const id = useId().replace(/:/g, '')

  const rotation = isDark ? (isBooped ? 28 : 40) : 90

  const svgSpring = useSpring({
    transform: `rotate(${rotation}deg)`,
    immediate: prefersReducedMotion,
    config: isTransitioning ? DEFAULT_CONFIG : SPRINGS.springy
  })
  const moonCutoutSpring = useSpring({
    cx: 12,
    cy: isDark ? 4 : -4,
    config: DEFAULT_CONFIG,
    immediate: prefersReducedMotion
  })
  const sunMoonSpring = useSpring({
    // prettier-ignore
    r: isDark
       ? MOON_RADIUS
       : isBooped
         ? SUN_RADIUS - 2
         : SUN_RADIUS,
    immediate: prefersReducedMotion,
    config:
      isBooped && !isTransitioning
        ? { tension: 300, friction: 20 }
        : DEFAULT_CONFIG
  })

  const sunMaskSpring = useSpring({
    r: isDark ? MOON_RADIUS + 1 : SUN_RADIUS + 1,
    immediate: prefersReducedMotion,
    config: DEFAULT_CONFIG
  })

  const sunDotAngles = range(NUM_OF_DOTS).map((_, index) => {
    return index * (360 / NUM_OF_DOTS)
  })

  const sunDotTrail = useTrail(sunDotAngles.length, {
    isVisible: isDark ? 0 : 1,
    transformOrigin: 'center center',
    immediate: isDark || prefersReducedMotion,
    config: {
      tension: 210,
      friction: 20
    }
  })
  const sunDotSpring = useSpring({
    hypothenuse: isBooped ? 9 : 10,
    config: SPRINGS.springy
  })

  return (
    <animated.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="relative block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      strokeWidth={strokeWidth}
      style={svgSpring}
    >
      {/* Sun dots mask */}
      <mask id={`sun-dot-mask-${id}`}>
        <rect x="-10" y="-10" width="44" height="44" fill="#fff" />
        <circle cx="12" cy="12" r={SUN_RADIUS} fill="#000" />
      </mask>

      {/* Moon cutout mask */}

      <mask id={`moon-cutout-mask-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="#FFF" />
        <animated.circle r="8" fill="#000" {...moonCutoutSpring} />
      </mask>

      {/* Moon crescent mask */}
      <mask id={`moon-crescent-mask-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="#000" />
        <animated.circle cx="12" cy="12" fill="#FFF" {...sunMaskSpring} />
      </mask>

      {/* Sun dots */}
      <g mask={`url(#sun-dot-mask-${id})`}>
        {sunDotTrail.map(({ isVisible, ...props }, index) => {
          const angle = sunDotAngles[index]
          const angleInRads = (angle / 180) * Math.PI

          const calcAxis = (type: 'cos' | 'sin') =>
            sunDotSpring.hypothenuse.to((c) =>
              roundTo(SUN_DOTS_RADIUS + c * Math[type](angleInRads), 4)
            )

          let indexInInitialArray = SUN_DOTS_ANIMARION_ANGLES.indexOf(angle)
          if (sunDotAngles.length !== 8) {
            indexInInitialArray = index
          }

          return (
            <SunDot
              key={angle}
              data-include-enter-animation={String(!!includeEnterAnimation)}
              cx={calcAxis('cos')}
              cy={calcAxis('sin')}
              r={1.5}
              fill={color}
              style={
                {
                  ...props,
                  '--enter-animation-delay': `${
                    enterAnimationDelay + indexInInitialArray * 40
                  }ms`,
                  transform: isVisible.to((val) => `scale(${val})`)
                } as unknown as React.CSSProperties
              }
            />
          )
        })}
      </g>

      {/* Sun / Moon body */}
      <g mask={`url(#moon-cutout-mask-${id})`}>
        <animated.circle
          cx="12"
          cy="12"
          stroke={color}
          fill="none"
          {...sunMoonSpring}
        />
      </g>

      {/* Crescent circle*/}
      <g mask={`url(#moon-crescent-mask-${id})`}>
        <animated.circle
          {...moonCutoutSpring}
          r="8"
          stroke={color}
          fill="none"
        />
      </g>
    </animated.svg>
  )
}

export function ThemeMode({
  // Icon props
  size,
  color,
  strokeWidth,
  enterAnimationDelay = 0,
  // Interactive props
  ...delegated
}: IconInteractiveProps<BaseProps>) {
  const { theme, toggleTheme } = useThemeToggle()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const timeoutId = useRef<number | undefined>(undefined)

  const onTrigger = (event: React.MouseEvent<any>) => {
    event.preventDefault()

    toggleTheme()
    setIsTransitioning(true)

    window.clearTimeout(timeoutId.current)
    timeoutId.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <Interactive
      {...delegated}
      alt={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      boopOn="hover"
      onClick={onTrigger}
    >
      {({ isHoverBoop }) => (
        <SunMoonIcon
          isDark={theme === 'dark'}
          {...{
            size,
            color,
            strokeWidth,
            isBooped: isHoverBoop,
            isTransitioning,
            includeEnterAnimation: true,
            enterAnimationDelay
          }}
        />
      )}
    </Interactive>
  )
}

const SunDot = styled(animated.circle)`
  &[data-include-enter-animation='true'] {
    animation: pop 500ms cubic-bezier(0.07, 0.7, 0.35, 1.35) backwards;
    animation-delay: var(--enter-animation-delay);

    @keyframes pop {
      from {
        transform: scale(0);
      }
    }
  }
`
