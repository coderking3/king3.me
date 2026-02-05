import type { NextConfig } from 'next'

import withLinaria from 'next-with-linaria'

const nextConfig: NextConfig = {
  // Turn off React's strict mode
  reactStrictMode: false,
  // Enable React Compiler in Next.js.
  reactCompiler: true,
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      // BiliBili
      {
        protocol: 'http',
        hostname: 'i0.hdslb.com',
        port: '',
        pathname: `/**/*`
      },
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
        port: '',
        pathname: `/**/*`
      },
      // NeteaseCloudMusic (p3)
      {
        protocol: 'https',
        hostname: 'p3.music.126.net',
        port: '',
        pathname: `/**/*`
      },
      // NeteaseCloudMusic (p4)
      {
        protocol: 'https',
        hostname: 'p4.music.126.net',
        port: '',
        pathname: `/**/*`
      }
    ]
  },

  rewrites() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml'
      },
      {
        source: '/rss',
        destination: '/feed.xml'
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml'
      }
    ]
  }
}

export default withLinaria(nextConfig)
