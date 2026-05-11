/* eslint-disable typescript/consistent-type-definitions */
import type { RehypeShikiOptions } from '@shikijs/rehype'
import type {
  EvaluateOptions,
  MDXRemoteProps
} from 'next-mdx-remote-client/rsc'
import type { TocItem } from 'remark-flexible-toc'

import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import rehypeShiki from '@shikijs/rehype'
import {
  transformerNotationDiff,
  transformerNotationHighlight
} from '@shikijs/transformers'
import GithubSlugger from 'github-slugger'
import { evaluate } from 'next-mdx-remote-client/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkFlexibleToc from 'remark-flexible-toc'
import remarkGfm from 'remark-gfm'

import MdxLink from './MdxLink'
import MdxPre from './MdxPre'

type Scope = {
  toc: TocItem[]
}

interface EvaluateMdxProps {
  content: string
}

const mdxConfig: EvaluateOptions<Scope> = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkFlexibleToc],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor']
          }
        }
      ],
      [
        rehypeShiki,
        {
          themes: {
            dark: 'catppuccin-frappe',
            light: 'catppuccin-latte'
          },
          parseMetaString(str) {
            const meta: Record<string, string | boolean> = {}
            for (const match of str.matchAll(/(\w[\w-]*)(?:="([^"]*)")?/g)) {
              meta[`data-${match[1]}`] = match[2] ?? true
            }
            return meta
          },
          transformers: [
            // 挂载所需属性到 pre 节点上
            {
              name: 'mount-properties',
              pre(node) {
                node.properties['data-code'] = this.source
                node.properties['data-language'] = this.options.lang
              }
            },
            transformerNotationDiff({ matchAlgorithm: 'v3' }),
            transformerNotationHighlight({ matchAlgorithm: 'v3' }),
            transformerColorizedBrackets()
          ],
          addLanguageClass: true
        } as RehypeShikiOptions
      ]
    ]
  },
  vfileDataIntoScope: 'toc'
}

const mdxComponents: MDXRemoteProps['components'] = {
  a: MdxLink,
  pre: MdxPre
}

export async function evaluateMdx({ content }: EvaluateMdxProps) {
  const { content: mdx, scope } = await evaluate({
    source: content,
    options: mdxConfig,
    components: mdxComponents
  })

  const slugger = new GithubSlugger()
  const toc = scope.toc.map((item) => ({
    id: slugger.slug(item.value),
    text: item.value,
    level: item.depth
  }))

  return {
    mdx,
    toc
  }
}
