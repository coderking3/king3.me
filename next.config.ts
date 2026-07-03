import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

import { REMOTE_CDN_HOSTS } from '@/lib/image/remote'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Turn off React's strict mode
  reactStrictMode: false,
  // Enable React Compiler in Next.js.
  reactCompiler: true,

  cacheComponents: true,

  experimental: {
    rootParams: true
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Whitelist of quality values actually used in the app (required by Next.js 16)
    qualities: [70, 75, 85, 90],
    // Cache TTL for built-in optimizer output (local images / unknown-host fallback only)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Aligned with Tailwind breakpoints, for vw-based responsive images (fill grids, hero images)
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    // For fixed-pixel small images (avatars, thumbnails)
    imageSizes: [32, 48, 64, 96, 128, 192, 256],
    remotePatterns: REMOTE_CDN_HOSTS.map((hostname) => [
      { protocol: 'http' as const, hostname, pathname: '/**/*' },
      { protocol: 'https' as const, hostname, pathname: '/**/*' }
    ]).flat()
  },

  rewrites() {
    return ['/feed', '/rss', '/rss.xml'].map((path) => ({
      source: path,
      destination: '/feed.xml'
    }))
  }
}

export default withNextIntl(nextConfig)
