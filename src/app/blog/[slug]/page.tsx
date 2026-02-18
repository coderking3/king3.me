import { PostsPage } from '@/components/blocks'
import { getPostsBySlug } from '@/lib/posts'

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = await getPostsBySlug(slug)

  return <PostsPage posts={posts} />
}
