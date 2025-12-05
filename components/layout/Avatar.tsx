/* eslint-disable no-console */
'use client'

import Image from 'next/image'

interface AvatarProps {
  page: string
}

function Avatar({ page }: AvatarProps) {
  console.log(`🚀 ~ page:`, page)
  return (
    <>
      <Image width={36} height={36} src="/images/king3.me.jpg" alt="king3" />
    </>
  )
}

export default Avatar
