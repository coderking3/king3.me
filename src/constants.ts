import type { SpringConfig } from '@react-spring/web'

type NavKey = 'home' | 'blog' | 'project' | 'message' | 'about'

interface NavigationItem {
  key: NavKey
  href: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { key: 'blog', href: '/blog' },
  { key: 'project', href: '/project' },
  { key: 'message', href: '/message' },
  { key: 'about', href: '/about' }
]

export const SPRINGS: Record<'springy', SpringConfig> = {
  springy: {
    /* Spring stiffness. Higher values produce more vigorous motion. Default: 100. */
    tension: 300,
    /* Damping force. If set to 0, the spring will oscillate indefinitely. Default: 10. */
    friction: 10
  }
}

export const AUTHOR_INFO = {
  name: 'King3',
  email: 'king3.wm@gmail.com',
  link: 'https://github.com/coderking3'
}

export const COPYRIGHT = '© 2025-present King3. All Rights Reserved.'

export const SOCIAL_URLS = {
  github: 'https://github.com/coderking3',
  youtube: 'https://www.youtube.com/@KingCoder-mp1hd',
  bilibili: 'https://space.bilibili.com/627872080',
  x: 'https://x.com/coderking_3',
  openknights: 'https://github.com/OpenKnights'
} as const

export const STAGGER = {
  base: 0.12,
  step: 0.04
} as const

export const GALLERYS: string[] = [
  'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png',
  'https://i0.hdslb.com/bfs/openplatform/47696dfbc15966645d7d3374306e1e0976cb48b3.jpg',
  'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg',
  'https://i0.hdslb.com/bfs/openplatform/8c8b12e1097d36605790a7a91e8e98968f7589f4.jpg',
  'https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg',
  'https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png'
]
