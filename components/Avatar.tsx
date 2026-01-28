/* eslint-disable next/no-img-element */
'use client'

interface AvatarProps {
  size?: number
  rounded?: number
  style?: React.CSSProperties
}

const AVATAR_SRC = '/avatar.png'
const AVATAR_ALT = 'King3'

function Avatar({ size = 25, rounded = 999, style }: AvatarProps) {
  return (
    <img
      src={AVATAR_SRC}
      alt={AVATAR_ALT}
      style={{
        ...(style ?? {}),
        borderRadius: rounded
      }}
      width={size}
    />
  )
}

export default Avatar
