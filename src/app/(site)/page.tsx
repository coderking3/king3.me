import { getPlaylist } from '@/data/playlist'
import { getAllPosts } from '@/lib/content'
import { randomArr } from '@/lib/math'
import { HomePage } from '@/views/home'

export default async function Page() {
  const [songsData, allPosts] = await Promise.all([
    getPlaylist(),
    getAllPosts()
  ])

  const songs = randomArr(songsData, 5)
  const posts = allPosts.slice(0, 10)

  return <HomePage songs={songs} posts={posts} />
}

export const revalidate = 60
