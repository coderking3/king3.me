'use client'

import type { IconInteractiveProps } from './Interactive'

import type { MotionOptions, SvgIcon } from '@/types'

import { motion } from 'framer-motion'

import { MOTION_SPRINGS } from '@/constants'

import Interactive from './Interactive'

interface CameraIconProps extends SvgIcon {
  isHoverBoop?: boolean
  isClickBoop?: boolean
}

export function CameraIcon({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  isHoverBoop = false,
  isClickBoop = false
}: CameraIconProps) {
  const iconMotion: MotionOptions = {
    animate: {
      scale: isHoverBoop ? 1.08 : 1,
      rotate: isHoverBoop ? 2 : 0
    },
    transition: MOTION_SPRINGS.springy
  }
  const lensMotion: MotionOptions = {
    animate: { scale: isClickBoop ? 0.85 : isHoverBoop ? 1.1 : 1 },
    transition: MOTION_SPRINGS.springy
  }
  const flashMotion: MotionOptions = {
    animate: { opacity: isClickBoop ? 0.1 : 1 },
    transition: MOTION_SPRINGS.springy
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      strokeWidth={strokeWidth}
      {...iconMotion}
    >
      {/* 相机机身 */}
      <motion.path
        fill={color}
        d="M4 21q-.825 0-1.412-.587Q2 19.825 2 19V7q0-.825.588-1.412Q3.175 5 4 5h3.15L8.7 3.325q.15-.15.337-.238Q9.225 3 9.425 3h5.15q.2 0 .388.087q.187.088.337.238L16.85 5H20q.825 0 1.413.588Q22 6.175 22 7v12q0 .825-.587 1.413Q20.825 21 20 21Zm16-2V7h-4.05l-1.825-2h-4.25L8.05 7H4v12Z"
      />

      {/* 镜头圆环 */}
      <motion.path
        fill={color}
        fillRule="evenodd"
        d="M12 18q2.075 0 3.538-1.462Q17 15.075 17 13q0-2.075-1.462-3.538Q14.075 8 12 8Q9.925 8 8.463 9.462Q7 10.925 7 13q0 2.075 1.463 3.538Q9.925 18 12 18Zm0-2q-1.25 0-2.125-.875T9 13q0-1.25.875-2.125T12 10q1.25 0 2.125.875T15 13q0 1.25-.875 2.125T12 16Z"
        {...lensMotion}
      />

      {/* 闪光灯 */}
      <motion.circle cx="18" cy="9" r="1" fill={color} {...flashMotion} />
    </motion.svg>
  )
}

export function Camera({
  // Icon props
  size,
  color,
  strokeWidth,
  // Interactive props
  ...restProps
}: IconInteractiveProps) {
  return (
    <Interactive {...restProps} boopOn={['hover', 'click']}>
      {({ isHoverBoop, isClickBoop }) => (
        <CameraIcon
          {...{ size, color, strokeWidth, isHoverBoop, isClickBoop }}
        />
      )}
    </Interactive>
  )
}
