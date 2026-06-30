import { getSongs } from '@/data/playlist'
import { PlaylistPage } from '@/views/admin'

export default async function Page() {
  const playlist = (await getSongs()) || []

  return <PlaylistPage playlist={playlist} />
}
