'use client'

import type { SvgIcon } from './_internal/types'

interface EqualizerProps extends SvgIcon {}

export function Equalizer({
  size = 20,
  color = 'currentColor'
}: EqualizerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="block overflow-visible"
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      fill={color}
    >
      <rect x="2" y="10" width="2" height="4" rx="1">
        <animate
          attributeName="height"
          values="4;12;4"
          dur="1s"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="y"
          values="10;6;10"
          dur="1s"
          repeatCount="indefinite"
        ></animate>
      </rect>
      <rect x="6.5" y="8" width="2" height="8" rx="1">
        <animate
          attributeName="height"
          values="8;16;8"
          dur="1s"
          repeatCount="indefinite"
          begin="0.2s"
        ></animate>
        <animate
          attributeName="y"
          values="8;4;8"
          dur="1s"
          repeatCount="indefinite"
          begin="0.2s"
        ></animate>
      </rect>
      <rect x="11" y="5" width="2" height="14" rx="1">
        <animate
          attributeName="height"
          values="14;20;14"
          dur="1s"
          repeatCount="indefinite"
          begin="0.4s"
        ></animate>
        <animate
          attributeName="y"
          values="5;2;5"
          dur="1s"
          repeatCount="indefinite"
          begin="0.4s"
        ></animate>
      </rect>
      <rect x="15.5" y="8" width="2" height="8" rx="1">
        <animate
          attributeName="height"
          values="8;16;8"
          dur="1s"
          repeatCount="indefinite"
          begin="0.6s"
        ></animate>
        <animate
          attributeName="y"
          values="8;4;8"
          dur="1s"
          repeatCount="indefinite"
          begin="0.6s"
        ></animate>
      </rect>
      <rect x="20" y="10" width="2" height="4" rx="1">
        <animate
          attributeName="height"
          values="4;12;4"
          dur="1s"
          repeatCount="indefinite"
          begin="0.8s"
        ></animate>
        <animate
          attributeName="y"
          values="10;6;10"
          dur="1s"
          repeatCount="indefinite"
          begin="0.8s"
        ></animate>
      </rect>
    </svg>
  )
}
