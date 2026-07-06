import type { AuthorInfo, GalleryItem } from '@/types'

import process from 'node:process'

import { getRemoteImageUrl } from '@/lib/image'

/* Site */

export const SITE_NAME = 'King3'

export const SITE_URL = new URL(
  process.env.SITE_URL ?? 'https://blog.king3.site'
)

export const COPYRIGHT = `© 2025-present ${SITE_NAME}. All Rights Reserved.`

/* Social & Profile */

export const SOCIAL_URLS = {
  github: 'https://github.com/coderking3',
  youtube: 'https://www.youtube.com/@KingCoder-mp1hd',
  bilibili: 'https://space.bilibili.com/627872080',
  x: 'https://x.com/coderking_3',
  openknights: 'https://github.com/OpenKnights'
} as const

export const PROFILE = {
  name: SITE_NAME,
  email: 'king3.wm@gmail.com',
  github: {
    name: 'coderking3',
    link: SOCIAL_URLS.github
  },
  twitter: {
    name: '@coderking_3',
    link: SOCIAL_URLS.x
  }
} as const

/* Author */

export const AUTHOR: AuthorInfo = {
  name: PROFILE.name,
  email: PROFILE.email,
  link: PROFILE.github.link
} as const

/* Gallery */

export const GALLERYS: GalleryItem[] = [
  {
    name: 'Original Gundam Keyboard',
    url: 'http://i0.hdslb.com/bfs/openplatform/d1e5599055b967325d51d45745e57d77e8af0eb8.jpg'
  },
  {
    name: 'Seaside Blue Hour',
    url: 'http://i0.hdslb.com/bfs/openplatform/521430cee97678bac9fcbb8e6b5477fe2c645012.jpg'
  },
  {
    name: 'Seaside, beach, platform, sky',
    url: 'http://i0.hdslb.com/bfs/openplatform/9d18919881eccefd9789ad4ee1f48c1ae1aa7114.jpg'
  },
  {
    name: 'The moon over the beach by the sea',
    url: 'https://i0.hdslb.com/bfs/openplatform/769f79ee86aed7b14eca863700a6eb9ca19caaa3.jpg'
  },
  {
    name: 'Blue sky and streetlights',
    url: 'http://i0.hdslb.com/bfs/openplatform/659662ae007ee9a54c5e95ee6c442e5c34cf5d32.jpg'
  },
  {
    name: 'A narrow alley late at night',
    url: 'http://i0.hdslb.com/bfs/openplatform/e1e6aaf10448b1136da1354e3b7e023d4344e963.jpg'
  }
].map((item) => ({
  ...item,
  url: getRemoteImageUrl(item.url, { bilibili: { format: 'webp' } })
}))

export * from './animation'
export * from './nav'
