'use client'

import type { ImageLoaderProps } from 'next/image'

/**  Let next/image directly output the compressed URLs from various CDNs, bypassing Next.js's own /_next/image reprocessing. */
export function remoteCdnLoader({ src, width }: ImageLoaderProps): string {
  try {
    const url = new URL(src)

    switch (url.hostname) {
      case 'i0.hdslb.com':
        return `${src}@${width}w_1e_1c.webp`

      case 'p3.music.126.net':
      case 'p4.music.126.net': {
        const sep = src.includes('?') ? '&' : '?'
        return `${src}${sep}param=${width}y${width}&type=webp`
      }

      case 'avatars.githubusercontent.com':
        url.searchParams.set('size', String(width))
        return url.toString()

      case 'lh3.googleusercontent.com':
        return `${src.split('=')[0]}=s${width}-c`

      default:
        return src
    }
  } catch {
    return src
  }
}

/** Manually construct a compressed image URL with a fixed width (bypassing the Image component's width inference), for use in low-quality placeholder layers and similar scenarios. */
export function getCdnResizedUrl(src: string, width: number): string {
  return remoteCdnLoader({ src, width })
}
