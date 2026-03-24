'use client'

import type { Playlist } from '@/types'

import { Music, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteSongAction } from '@/app/actions/playlist'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'

import SongFormDialog from './SongFormDialog'

function PlaylistTable({ playlist }: { playlist: Playlist[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editSong, setEditSong] = useState<Playlist | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteSongAction(deleteId)
    if (result.success) {
      toast.success('Song deleted')
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Playlist</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Add Song
        </Button>
      </div>

      {playlist.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
          <Music size={48} className="mb-4 opacity-30" />
          <p>No songs yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlist.map((song) => (
              <TableRow key={song.id}>
                <TableCell>
                  <Image
                    src={`${song.cover}?waadw=40y40&type=webp`}
                    alt={song.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{song.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {song.author.join(' / ')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {song.duration}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {song.order}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditSong(song)}
                      className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(song.id)}
                      className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SongFormDialog open={showCreate} onClose={() => setShowCreate(false)} />

      <SongFormDialog
        open={!!editSong}
        song={editSong}
        onClose={() => setEditSong(null)}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete song</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the song from the playlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PlaylistTable
