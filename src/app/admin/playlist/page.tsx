import { getPlaylistAction } from '@/app/actions/playlist'
import { PlaylistPage } from '@/views/admin'

export default async function Page() {
  const result = await getPlaylistAction()
  if (!result.success) throw new Error(result.error)

  return <PlaylistPage playlist={result.data} />
}
