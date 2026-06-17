import { getPlaylist } from '@/data/playlist'
import { PlaylistPage } from '@/views/admin'

export default async function Page() {
  const playlist = (await getPlaylist()) || []

  return <PlaylistPage playlist={playlist} />
}
