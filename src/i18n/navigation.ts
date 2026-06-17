import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

export const {
  Link, // 替换 next/link 的 Link
  redirect, // 替换 next/navigation 的 redirect
  usePathname, // 替换 next/navigation 的 usePathname
  useRouter, // 替换 next/navigation 的 useRouter
  getPathname,
  permanentRedirect
} = createNavigation(routing)
