'use client'

import style from './style.module.css'

interface LogoProps {
  size?: number
}

const SIZE = 24
const STROKE_WIDTH = 1.5

function Logo({ size = SIZE }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={style['logo-animate']}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12H17"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        className={style['divider-line']}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2882 3.25L2.59238 19.6487L2.00836 20.7501H3.25499H3.66804L11.3418 6.27864L12.0044 5.02909L12.667 6.27864L20.3408 20.7501H20.754H22.0006L21.4166 19.6487L12.7208 3.25H11.2882Z"
        fill="currentColor"
        className={style['arrow-up']}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25499 3.25H3.66807L11.3418 17.7214L12.0044 18.9709L12.667 17.7214L20.3408 3.25H20.754H22.0006L21.4166 4.35136L12.7208 20.75H11.2881L2.59238 4.35136L2.00836 3.25H3.25499Z"
        fill="currentColor"
        className={style['arrow-down']}
      />
    </svg>
  )
}

export default Logo
