import { getPlaylistAction } from '@/actions/playlist'
import { PlaylistPage } from '@/views/admin'

export default async function Page() {
  const result = await getPlaylistAction()

  return <PlaylistPage playlist={result.data || []} />
}
