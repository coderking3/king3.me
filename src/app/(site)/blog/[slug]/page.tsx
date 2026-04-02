import { getPostsBySlug } from '@/lib/posts'
import { PostsPage } from '@/views/blog'

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = await getPostsBySlug(slug)

  return <PostsPage posts={posts} />
}
