import type { NextConfig } from 'next'

import { withPayload } from '@payloadcms/next/withPayload'
import withLinaria from 'next-with-linaria'

import { withMDX, withNextConfig } from './lib/config'

const nextConfig: NextConfig = {
  // Turn off React's strict mode
  reactStrictMode: false,
  // Enable React Compiler in Next.js.
  reactCompiler: true,
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
        port: '',
        pathname: `/bfs/openplatform/**`
      }
    ]
  },

  // redirects() {
  //   return [
  //     {
  //       source: '/x',
  //       destination: 'https://x.com/king3',
  //       permanent: true
  //     },
  //     {
  //       source: '/youtube',
  //       destination: 'https://youtube.com/@king3',
  //       permanent: true
  //     },
  //     {
  //       source: '/github',
  //       destination: 'https://github.com/king3',
  //       permanent: true
  //     },
  //     {
  //       source: '/bilibili',
  //       destination: 'https://space.bilibili.com/king3',
  //       permanent: true
  //     }
  //   ]
  // },

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

export default withNextConfig(withMDX, withPayload, withLinaria)(nextConfig)
