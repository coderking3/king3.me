import { getPlaylistAction } from '@/app/actions/playlist'
// import PlaylistTable from '@/components/blocks/admin/PlaylistTable'
import { Animated } from '@/components/common'

export default async function AdminPlaylistPage() {
  const result = await getPlaylistAction()
  if (!result.success) throw new Error(result.error)

  return (
    <Animated preset="fadeIn">
      <h1 className="mb-4 text-lg font-semibold">Playlist</h1>
      {/* <PlaylistTable playlist={result.data} /> */}
    </Animated>
  )
}
