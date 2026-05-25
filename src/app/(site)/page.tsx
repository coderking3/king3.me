import { getPlaylist } from '@/data/playlist'
import { getAllPosts } from '@/lib/content'
import { getDailySeed, seededShuffle } from '@/lib/math'
import { HomePage } from '@/views/home'

export default async function Page() {
  const [songsData, allPosts] = await Promise.all([
    getPlaylist(),
    getAllPosts()
  ])

  const seed = getDailySeed()
  const songs = seededShuffle(songsData, seed).slice(0, 5)
  const posts = allPosts.slice(0, 10)

  return <HomePage songs={songs} posts={posts} />
}

export const revalidate = 60
