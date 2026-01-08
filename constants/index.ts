import type { SpringConfig } from '@react-spring/web'
import type { Transition } from 'framer-motion'

export const NAVIGATION_ITEMS = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Posts',
    href: '/posts'
  },
  {
    name: 'Projects',
    href: '/projects'
  },
  {
    name: 'Message',
    href: '/message'
  }
]

export const TRANSITIONS: Record<'springy', Transition> = {
  springy: {
    type: 'spring',
    /* 弹簧刚度。数值越高，运动越剧烈。默认值为 100。 */
    stiffness: 300,
    /* 反作用力的大小。如果设置为 0，弹簧将无限振荡。默认值为 10。 */
    damping: 10
  }
} as const
export const MOTION_SPRINGS = TRANSITIONS

export const SPRINGS: Record<'springy', SpringConfig> = {
  springy: {
    /* 弹簧刚度。数值越高，运动越剧烈。默认值为 100。 */
    tension: 300,
    /* 反作用力的大小。如果设置为 0，弹簧将无限振荡。默认值为 10。 */
    friction: 10
  }
} as const
