export const NAVIGATION_ITEMS = [
  { key: 'blog', href: '/blog' },
  { key: 'project', href: '/project' },
  { key: 'message', href: '/message' },
  { key: 'about', href: '/about' }
] as const

export const EXPLORE_LINKS = [
  { key: 'photos', href: '/photos' },
  { key: 'poems', href: '/poems' },
  { key: 'use', href: '/use' }
] as const

export const MOBILE_NAVIGATION_ITEMS = [
  ...NAVIGATION_ITEMS,
  ...EXPLORE_LINKS
] as const

export const ADMIN_NAVIGATION_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/messages', label: 'Messages', icon: 'messages' },
  { href: '/admin/users', label: 'Users', icon: 'user' },
  { href: '/admin/playlist', label: 'Playlist', icon: 'music' },
  { href: '/admin/photos', label: 'Photos', icon: 'image' },
  { href: '/admin/poems', label: 'Poems', icon: 'feather' },
  { href: '/admin/projects', label: 'Projects', icon: 'folder' }
] as const
