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

export const MOTION_SPRINGS: Record<'springy', Transition> = {
  springy: { type: 'spring', stiffness: 300, damping: 10 }
}
