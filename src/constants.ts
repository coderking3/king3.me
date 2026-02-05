import type { SpringConfig } from '@react-spring/web'

export const NAVIGATION_ITEMS = [
  {
    name: 'Blog',
    href: '/blog'
  },
  {
    name: 'Project',
    href: '/project'
  },
  {
    name: 'Message',
    href: '/message'
  },
  {
    name: 'About',
    href: '/about'
  }
]

export const SPRINGS: Record<'springy', SpringConfig> = {
  springy: {
    /* 弹簧刚度。数值越高，运动越剧烈。默认值为 100。 */
    tension: 300,
    /* 反作用力的大小。如果设置为 0，弹簧将无限振荡。默认值为 10。 */
    friction: 10
  }
} as const
