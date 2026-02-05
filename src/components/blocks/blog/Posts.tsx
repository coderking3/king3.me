import { getAllPosts } from '@/lib/posts'

import PostsCard from './PostsCard'

async function Posts({ limit = 5 }: { limit?: number }) {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, limit)

  return (
    <>
      {posts.map((post) => (
        <PostsCard key={post.slug} metadata={post} />
      ))}
    </>
  )
}

export default Posts
