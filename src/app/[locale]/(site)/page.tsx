import { getSongs } from '@/data/playlist'
import { getAllPosts } from '@/lib/content'
import { HomePage } from '@/views/home'

export default async function Page() {
  const [songs, allPosts] = await Promise.all([getSongs(), getAllPosts()])

  const posts = allPosts.slice(0, 10)

  return <HomePage songs={songs} posts={posts} />
}
