import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turn off React's strict mode
  reactStrictMode: false,
  // Enable React Compiler in Next.js.
  reactCompiler: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      // BiliBili
      {
        protocol: 'http',
        hostname: 'i0.hdslb.com',
        pathname: `/**/*`
      },
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
        pathname: `/**/*`
      },
      // NeteaseCloudMusic
      {
        protocol: 'https',
        hostname: 'p3.music.126.net',
        pathname: `/**/*`
      },
      {
        protocol: 'https',
        hostname: 'p4.music.126.net',
        pathname: `/**/*`
      },
      // Github Usercontent
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: `/**/*`
      },
      // Google Usercontent
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
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
