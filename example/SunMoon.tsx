'use client'

import type { MotionValue } from 'framer-motion'

import { styled } from '@linaria/react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { IconWrapper } from '@/components/icons'
import { range, roundTo } from '@/lib/utils'

// constants
const SUN_RADIUS = 6
const MOON_RADIUS = 9.5
const NUM_OF_DOTS = 8
const INITIAL_ANIMATION_ANGLES = [180, 135, 225, 90, 270, 45, 315, 0]

interface SunMoonProps {
  isDark: boolean
  size?: number
  isBooped?: boolean
  isTransitioning?: boolean
  includeEnterAnimation?: boolean
  enterAnimationDelay?: number
}

function SunMoon({
  isDark,
  size = 20,
  isBooped = false,
  isTransitioning = false,
  includeEnterAnimation = false,
  enterAnimationDelay = 0
}: SunMoonProps) {
  const id = React.useId().replace(/:/g, '')

  // 旋转动画
  const rotation = isDark ? (isBooped ? 28 : 40) : 90
  const rotationSpring = useSpring(rotation, {
    stiffness: isTransitioning ? 160 : 300,
    damping: isTransitioning ? 30 : 10
  })
  const rotationTransform = useTransform(rotationSpring, (v) => `${v}deg`)

  // 月亮 cutout 动画
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

  // 太阳光点距离中心的距离（斜边）
  const sunDotHypothenuse = useSpring(isBooped ? 9 : 10, {
    stiffness: 300,
    damping: 10
  })

  const sunDotAngles = React.useMemo(
    () => range(NUM_OF_DOTS).map((_, index) => index * (360 / NUM_OF_DOTS)),
    []
  )

  return (
    <Svg
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      viewBox="0 0 24 24"
      style={{
        rotate: rotationTransform
      }}
    >
      {/* 太阳光点遮罩 - 防止光点显示在太阳内部 */}
      <mask id={`sun-dot-mask-${id}`}>
        <rect x="-10" y="-10" width="44" height="44" fill="#FFF" />
        <circle r={SUN_RADIUS} cx="12" cy="12" fill="#000" />
      </mask>

      {/* 月亮 cutout 遮罩 - 创建月牙效果 */}
      <mask id={`moon-cutout-mask-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="#FFF" />
        <motion.circle cx={moonCutoutCx} cy={moonCutoutCy} r="8" fill="#000" />
      </mask>

      {/* 月牙遮罩 - 限制月牙只显示在月亮上 */}
      <mask id={`moon-crescent-mask-${id}`}>
        <rect x="0" y="0" width="24" height="24" fill="#000" />
        <motion.circle cx="12" cy="12" r={sunMaskRadius} fill="#FFF" />
      </mask>

      {/* 太阳光点组 */}
      <g mask={`url(#sun-dot-mask-${id})`}>
        {sunDotAngles.map((angle, index) => (
          <SunDot
            key={angle}
            angle={angle}
            index={index}
            isDark={isDark}
            includeEnterAnimation={includeEnterAnimation}
            enterAnimationDelay={enterAnimationDelay}
            hypothenuse={sunDotHypothenuse}
          />
        ))}
      </g>

      {/* 太阳/月亮主体 */}
      <g mask={`url(#moon-cutout-mask-${id})`}>
        <motion.circle
          cx="12"
          cy="12"
          r={sunMoonRadius}
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
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
          strokeWidth="2"
        />
      </g>
    </Svg>
  )
}

interface SunDotProps {
  angle: number
  index: number
  isDark: boolean
  includeEnterAnimation: boolean
  enterAnimationDelay: number
  hypothenuse: MotionValue<number>
}

function SunDot({
  angle,
  index,
  isDark,
  includeEnterAnimation,
  enterAnimationDelay,
  hypothenuse
}: SunDotProps) {
  const centerX = 12
  const centerY = 12
  const angleInRads = (angle / 180) * Math.PI

  // 计算在初始动画序列中的位置
  let indexInInitialArray = INITIAL_ANIMATION_ANGLES.indexOf(angle)
  if (indexInInitialArray === -1) {
    indexInInitialArray = index
  }

  // 使用 useTransform 实现动画值的映射
  const cx = useTransform(hypothenuse, (h) =>
    roundTo(centerX + h * Math.cos(angleInRads), 4)
  )
  const cy = useTransform(hypothenuse, (h) =>
    roundTo(centerY + h * Math.sin(angleInRads), 4)
  )

  const sunDotScale = isDark ? 0 : 1

  return (
    <SunDotCircle
      data-include-enter-animation={String(!!includeEnterAnimation)}
      cx={cx}
      cy={cy}
      r={1.5}
      fill="currentColor"
      style={
        {
          '--enter-animation-delay': `${enterAnimationDelay + indexInInitialArray * 40}ms`
          // scale: sunDotScale
          // scale: prefersReducedMotion ? sunDotScale : undefined
        } as React.CSSProperties
      }
      initial={{ scale: 0 }}
      animate={{ scale: sunDotScale }}
      transition={{
        duration: 0.21,
        delay: isDark ? 0 : index * 0.04,
        ease: 'easeOut'
        // ease: [0.07, 0.7, 0.35, 1.35]
      }}
    />
  )
}

interface ToggleThemeModeProps extends React.HTMLAttributes<HTMLAnchorElement> {
  size?: number
  enterAnimationDelay?: number
}

export function ThemeMode({
  size = 20,
  enterAnimationDelay = 0,
  ...delegated
}: ToggleThemeModeProps) {
  const { theme, setTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const timeoutId = React.useRef<number | undefined>(undefined)

  const isDark = theme === 'dark'
  const onTrigger = (event: React.MouseEvent<any>) => {
    event.preventDefault()

    setTheme(isDark ? 'light' : 'dark')
    setIsTransitioning(true)

    window.clearTimeout(timeoutId.current)
    timeoutId.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  return (
    <IconWrapper
      alt={`Activate ${isDark ? 'light' : 'dark'} mode`}
      {...delegated}
      onClick={onTrigger}
    >
      {({ isBooped }) => (
        <SunMoon
          isDark={isDark}
          size={size}
          isBooped={isBooped}
          isTransitioning={isTransitioning}
          includeEnterAnimation={true}
          enterAnimationDelay={enterAnimationDelay}
        />
      )}
    </IconWrapper>
  )
}

const Svg = styled(motion.svg)`
  position: relative;
  overflow: visible;
  stroke-width: 2px;
  display: block;
`

const SunDotCircle = styled(motion.circle)`
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

export default ThemeMode
