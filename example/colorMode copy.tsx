'use client'

import { styled } from '@linaria/react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useTheme } from 'next-themes'
import * as React from 'react'

// 工具函数
const range = (start: number, end?: number, step: number = 1) => {
  const output = []
  if (typeof end === 'undefined') {
    end = start
    start = 0
  }
  for (let i = start; i < end; i += step) {
    output.push(i)
  }
  return output
}

const roundTo = (value: number, places = 0) =>
  Math.round(value * 10 ** places) / 10 ** places

// 检测用户是否偏好减少动画
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    )
    setPrefersReducedMotion(!mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches)
    }

    mediaQueryList.addEventListener('change', listener)
    return () => mediaQueryList.removeEventListener('change', listener)
  }, [])

  return prefersReducedMotion
}

interface IconColorModeProps {
  colorMode: 'light' | 'dark'
  size?: number
  isBooped?: boolean
  isTransitioning?: boolean
  includeEnterAnimation?: boolean
  enterAnimationDelay?: number
}

const SUN_RADIUS = 6
const MOON_RADIUS = 9.5

function IconColorMode({
  colorMode,
  size = 20,
  isBooped = false,
  isTransitioning = false,
  includeEnterAnimation = false,
  enterAnimationDelay = 0
}: IconColorModeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const id = React.useId().replace(/:/g, '')

  const isDark = colorMode === 'dark'

  // 旋转动画
  const rotation = isDark ? (isBooped ? 28 : 40) : 90
  const rotationSpring = useSpring(rotation, {
    stiffness: isTransitioning ? 160 : 300,
    damping: isTransitioning ? 30 : 10
  })

  // 月亮cutout动画
  const moonCutoutCx = 12
  const moonCutoutCy = useSpring(isDark ? 4 : -4, {
    stiffness: 160,
    damping: 30
  })

  // 太阳/月亮半径动画
  const targetRadius = isDark
    ? MOON_RADIUS
    : isBooped
      ? SUN_RADIUS - 2
      : SUN_RADIUS
  const sunMoonRadius = useSpring(targetRadius, {
    stiffness: isBooped && !isTransitioning ? 300 : 160,
    damping: isBooped && !isTransitioning ? 20 : 30
  })

  // 太阳遮罩半径
  const sunMaskRadius = useSpring(isDark ? MOON_RADIUS + 1 : SUN_RADIUS + 1, {
    stiffness: 160,
    damping: 30
  })

  // 太阳光点
  const numOfDots = 8
  const sunDotAngles = range(numOfDots).map(
    (_, index) => index * (360 / numOfDots)
  )

  const sunDotScale = isDark ? 0 : 1
  const sunDotHypothenuse = useSpring(isBooped ? 9 : 10, {
    stiffness: 300,
    damping: 10
  })

  // 初始动画角度顺序（从上到下级联）
  const initialAnimationAngles = [180, 135, 225, 90, 270, 45, 315, 0]

  const rotationTransform = useTransform(rotationSpring, (v) => `${v}deg`)

  return (
    <Svg
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      viewBox="0 0 24 24"
      style={{
        rotate: rotationTransform
      }}
    >
      {/* 太阳光点遮罩 */}
      <mask id={`sun-dot-mask-${id}`}>
        <rect x="-10" y="-10" width="44" height="44" fill="#FFF" />
        <circle r={SUN_RADIUS} cx="12" cy="12" fill="#000" />
      </mask>

      {/* 月亮cutout遮罩 */}
      <mask id={`moon-cutout-mask-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="#FFF" />
        <motion.circle cx={moonCutoutCx} cy={moonCutoutCy} r="8" fill="#000" />
      </mask>

      {/* 月牙遮罩 */}
      <mask id={`moon-crescent-mask-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="#000" />
        <motion.circle cx="12" cy="12" r={sunMaskRadius} fill="#FFF" />
      </mask>

      {/* 太阳光点 */}
      <g mask={`url(#sun-dot-mask-${id})`}>
        {sunDotAngles.map((angle, index) => {
          const centerX = 12
          const centerY = 12
          const angleInRads = (angle / 180) * Math.PI

          let indexInInitialArray = initialAnimationAngles.indexOf(angle)
          if (sunDotAngles.length !== 8) {
            indexInInitialArray = index
          }

          return (
            <SunDot
              key={angle}
              data-include-enter-animation={String(!!includeEnterAnimation)}
              r={1.5}
              fill="currentColor"
              style={
                {
                  '--enter-animation-delay': `${enterAnimationDelay + indexInInitialArray * 40}ms`,
                  scale: prefersReducedMotion ? sunDotScale : undefined,
                  cx: `calc(12px + ${sunDotHypothenuse.get()} * ${Math.cos(angleInRads).toFixed(4)})`,
                  cy: `calc(12px + ${sunDotHypothenuse.get()} * ${Math.sin(angleInRads).toFixed(4)})`
                } as React.CSSProperties
              }
              initial={{ scale: 0 }}
              animate={{
                scale: sunDotScale,
                cx: roundTo(
                  centerX + (isBooped ? 9 : 10) * Math.cos(angleInRads),
                  4
                ),
                cy: roundTo(
                  centerY + (isBooped ? 9 : 10) * Math.sin(angleInRads),
                  4
                )
              }}
              transition={{
                duration: 0.21,
                delay: isDark ? 0 : index * 0.04,
                ease: [0.07, 0.7, 0.35, 1.35]
              }}
            />
          )
        })}
      </g>

      {/* 太阳/月亮主体 */}
      <g mask={`url(#moon-cutout-mask-${id})`}>
        <motion.circle
          cx="12"
          cy="12"
          r={sunMoonRadius}
          stroke="currentColor"
          fill="none"
        />
      </g>

      {/* 月牙 */}
      <g mask={`url(#moon-crescent-mask-${id})`}>
        <motion.circle
          cx={moonCutoutCx}
          cy={moonCutoutCy}
          r="8"
          stroke="currentColor"
          fill="none"
        />
      </g>
    </Svg>
  )
}

interface WrappedIconColorModeProps {
  size?: number
  enterAnimationDelay?: number
  className?: string
}

export function WrappedIconColorMode({
  size,
  enterAnimationDelay = 0,
  className
}: WrappedIconColorModeProps) {
  const { theme, setTheme } = useTheme()
  const [isBooped, setIsBooped] = React.useState(false)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const timeoutId = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function handleClick() {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setIsTransitioning(true)

    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  function handleMouseEnter() {
    setIsBooped(true)
  }

  function handleMouseLeave() {
    setIsBooped(false)
  }

  // 避免服务端渲染不匹配
  if (!mounted) {
    return (
      <button
        className={className}
        style={{
          width: size ? `${size / 16}rem` : '1.25rem',
          height: size ? `${size / 16}rem` : '1.25rem'
        }}
      />
    )
  }

  const colorMode = theme === 'dark' ? 'dark' : 'light'

  return (
    <IconButton
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      aria-label={
        colorMode === 'dark' ? 'Activate light mode' : 'Activate dark mode'
      }
    >
      <IconColorMode
        colorMode={colorMode}
        size={size}
        isBooped={isBooped}
        isTransitioning={isTransitioning}
        includeEnterAnimation={true}
        enterAnimationDelay={enterAnimationDelay}
      />
    </IconButton>
  )
}

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 4px;
  }
`

const Svg = styled(motion.svg)`
  position: relative;
  overflow: visible;
  stroke-width: 2px;
`

const SunDot = styled(motion.circle)`
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

export default WrappedIconColorMode
