import { randomArr } from '@/lib/math'
import { getAllPosts } from '@/lib/posts'
import { HomePage } from '@/views/home'

import { getPlaylistAction } from '../actions/playlist'

export default async function Page() {
  const [result, allPosts] = await Promise.all([
    getPlaylistAction(),
    getAllPosts()
  ])

  const songs = result.success ? randomArr(result.data, 5) : []
  const posts = allPosts.slice(0, 10)

  return <HomePage songs={songs} posts={posts} />
}

export const revalidate = 60
