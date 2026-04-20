import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turn off React's strict mode
  reactStrictMode: false,
  // Enable React Compiler in Next.js.
  reactCompiler: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // experimental: {
  //   turbopackFileSystemCacheForDev: false
  // },

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
      },
      // Githubusercontent
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
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

export default nextConfig
