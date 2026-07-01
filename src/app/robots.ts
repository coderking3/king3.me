import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/constants'
import { routing } from '@/i18n/routing'

export default function robots(): MetadataRoute.Robots {
  const adminPaths = [
    '/admin/',
    ...routing.locales.map((locale) => `/${locale}/admin/`)
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...adminPaths, '/api/']
      }
    ],
    sitemap: new URL('sitemap.xml', SITE_URL).href
  }
}
