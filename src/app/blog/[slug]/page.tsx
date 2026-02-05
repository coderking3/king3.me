import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

import { getPostsBySlug } from '@/lib/posts'

// rehype-pretty-code 配置
const rehypePrettyCodeOptions = {
  theme: {
    dark: 'catppuccin-frappe',
    light: 'catppuccin-latte'
  },
  keepBackground: false
}

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { metadata, content } = await getPostsBySlug(slug)

  // const {} = getPostsBySlug(slug)
  // console.log(`🚀 ~ slug:`, slug)

  return (
    <div className="mt-24">
      {/* className="max-w-4xl mx-auto px-4 py-8" */}
      <div className="mx-auto max-w-6xl px-8">
        <article className="mx-auto max-w-4xl">
          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">{metadata.title}</h1>
            <div className="text-sm text-gray-500">
              <time dateTime={new Date(metadata.date).toISOString()}>
                {new Date(metadata.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="ml-4">作者：{'King3'}</span>
              {/* {metadata.author && (
          )} */}
            </div>
          </header>

          {/* MDX 内容 */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]]
                }
              }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
