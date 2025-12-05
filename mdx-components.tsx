// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

import Image from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-12 mb-6 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold">{children}</h2>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),

    // Shiki 会处理 pre 和 code,保持简单
    pre: ({ children, ...props }) => <pre {...props}>{children}</pre>,

    // 内联代码
    code: ({ children, ...props }) => {
      // 如果有 className,说明是代码块,让 Shiki 处理
      if (props.className) {
        return <code {...props}>{children}</code>
      }
      // 内联代码
      return (
        <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800">
          {children}
        </code>
      )
    },

    img: ({ src, alt }) => (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={600}
        className="my-6 rounded-lg"
      />
    ),

    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http')
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {children}
          </a>
        )
      }
      return (
        <Link
          href={href || '#'}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {children}
        </Link>
      )
    },

    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic dark:border-gray-700">
        {children}
      </blockquote>
    ),

    ...components
  }
}
