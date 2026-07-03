'use client'

import type { ImageLoaderProps } from 'next/image'

const GOOGLE_SIZE_SUFFIX_RE = /=s\d.*$/

/**
 * Rewrites remote image URLs to use each CDN's own resize/compression
 * params instead of proxying through Next.js's built-in /_next/image
 * optimizer, offloading resizing to the origin CDN.
 *
 * Falls back to the built-in optimizer for local paths and unknown hosts —
 * keep `remotePatterns` configured in next.config.ts for those cases.
 */
export function remoteCdnLoader({
  src,
  width,
  quality
}: ImageLoaderProps): string {
  const q = quality ?? 75
  const defaultUrl = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`

  let hostname: string
  try {
    hostname = new URL(src).hostname
  } catch {
    return defaultUrl
  }

  switch (hostname) {
    case 'i0.hdslb.com':
      // width + quality compression, output webp
      return `${src}@${width}w_1e_1c_${q}q.webp`

    case 'p3.music.126.net':
    case 'p4.music.126.net': {
      // param=<w>y<h>
      const sep = src.includes('?') ? '&' : '?'
      return `${src}${sep}param=${width}y${width}&type=webp`
    }

    case 'avatars.githubusercontent.com': {
      const url = new URL(src)
      url.searchParams.set('size', String(width))
      return url.toString()
    }

    case 'lh3.googleusercontent.com':
      // replace/append the =s<size>-c suffix
      return src.replace(GOOGLE_SIZE_SUFFIX_RE, `=s${width}-c`)

    default:
      return defaultUrl
  }
}
