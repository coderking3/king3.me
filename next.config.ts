import type { NextConfig } from 'next'
import type { LinariaTransformLoaderOptions } from 'next-with-linaria/lib/types'

import createMDX from '@next/mdx'
import { withPayload } from '@payloadcms/next/withPayload'
import withLinaria from 'next-with-linaria'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

interface WithLinariaConfig {
  linaria: LinariaTransformLoaderOptions
}

const nextConfig: NextConfig & WithLinariaConfig = {
  // Turn off React's strict mode
  reactStrictMode: false,
  // Enable React Compiler in Next.js.
  reactCompiler: true,
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // With Linaria Config
  linaria: {
    fastCheck: true
  }
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [[remarkGfm]],
    rehypePlugins: [
      [rehypeSlug],
      [
        rehypePrettyCode,
        {
          // shiki themes
          theme: {
            dark: 'catppuccin-macchiato',
            light: 'catppuccin-latte'
          },

          // 保留内联代码的样式
          keepBackground: false,

          // 显示行号
          onVisitLine(node: any) {
            // 防止空行折叠
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          // 高亮行样式
          onVisitHighlightedLine(node: any) {
            node.properties.className?.push('highlighted')
          },
          // 高亮字符样式
          onVisitHighlightedChars(node: any) {
            node.properties.className = ['word']
          }
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor']
          }
        }
      ]
    ]
  }
})

const withConfig =
  (...fns: ((config: NextConfig) => NextConfig)[]) =>
  (config: NextConfig) =>
    fns.reduce((cfg, fn) => fn(cfg), config)

export default withConfig(withMDX, withPayload, withLinaria)(nextConfig)
