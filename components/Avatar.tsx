/* eslint-disable next/no-img-element */
'use client'

interface AvatarProps {
  size?: number
  rounded?: number
  style?: React.CSSProperties
}

const LOCAL_AVATAR_LINK = '/images/king3.me.jpg'
const REMOTE_AVATAR_LINK =
  'https://i0.hdslb.com/bfs/openplatform/5b3f3a880d7b9265c703e96e4c6dad28b22b91fc.jpg'

const AVATAR_Sx = REMOTE_AVATAR_LINK
const AVATAR_ALT = 'King3'

function Avatar({ size = 25, rounded = 99, style }: AvatarProps) {
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
