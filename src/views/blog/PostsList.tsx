import { getAllPosts } from '@/lib/posts'

import PostsCard from './PostsCard'

async function PostsList({ limit = 5 }: { limit?: number }) {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, limit)

  return (
    <>
      {posts.map((post, index) => (
        <PostsCard key={post.slug} index={index} metadata={post} />
      ))}
    </>
  )
}

export default PostsList
