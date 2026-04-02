import { randomList } from '@/lib/math'
import { HomePage } from '@/views/home'

import { getPlaylistAction } from '../actions/playlist'

export default async function Page() {
  const result = await getPlaylistAction()
  const songs = result.success ? randomList(result.data, 5) : []

  return <HomePage songs={songs} />
}
