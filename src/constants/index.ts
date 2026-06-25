import type { AuthorInfo } from '@/types'

import process from 'node:process'

/* Site */

export const SITE_NAME = 'King3'

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://king3-me.vercel.app'
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

export const GALLERYS: string[] = [
  'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png',
  'https://i0.hdslb.com/bfs/openplatform/47696dfbc15966645d7d3374306e1e0976cb48b3.jpg',
  'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg',
  'https://i0.hdslb.com/bfs/openplatform/8c8b12e1097d36605790a7a91e8e98968f7589f4.jpg',
  'https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg',
  'https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png'
]

export * from './animation'
export * from './nav'
