'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnConfig, FormFieldConfig } from '@/components'
import type { Playlist } from '@/types'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  batchDeleteSongsAction,
  createSongAction,
  deleteSongAction,
  updateSongAction
} from '@/app/actions/playlist'
import { Animated, Confirm, DataTable, Form, Modal } from '@/components'
import { Button } from '@/components/ui'

// ──── Form Config ────

const songFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  author: z.string().min(1, 'Artist is required'),
  cover: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  url: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  duration: z
    .string()
    .regex(/^(\d{1,2}:)?\d{2}:\d{2}$|^$/, 'Format: MM:SS or HH:MM:SS')
})

type SongFormValues = z.infer<typeof songFormSchema>

const songFields: FormFieldConfig<SongFormValues>[] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'Song name' },
  {
    name: 'author',
    label: 'Artist (comma separated)',
    type: 'input',
    placeholder: 'Artist 1, Artist 2'
  },
  {
    name: 'cover',
    label: 'Cover URL',
    type: 'input',
    placeholder: 'https://...'
  },
  {
    name: 'url',
    label: 'Audio URL',
    type: 'input',
    placeholder: 'https://...'
  },
  {
    name: 'duration',
    label: 'Duration',
    type: 'input',
    placeholder: 'e.g. 03:52'
  }
]

// ──── Table Columns ────

const columns: ColumnConfig<Playlist>[] = [
  {
    key: 'cover',
    title: 'Cover',
    render: (_, record) => (
      <Image
        src={`${record.cover}?waadw=40y40&type=webp`}
        alt={record.name}
        width={40}
        height={40}
        className="rounded"
      />
    )
  },
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (value) => <span className="text-sm font-medium">{value}</span>
  },
  {
    key: 'author',
    title: 'Artist',
    render: (value: string[]) => (
      <span className="text-muted-foreground text-sm">{value.join(' / ')}</span>
    )
  },
  {
    key: 'duration',
    title: 'Duration',
    render: (value) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {value}
      </span>
    )
  },
  {
    key: 'order',
    title: 'Order',
    className: 'text-center',
    render: (value) => (
      <span className="text-muted-foreground text-sm">{value}</span>
    )
  }
]

// ──── Component ────

export default function PlaylistComponent({
  playlist
}: {
  playlist: Playlist[]
}) {
  const tableRef = useRef<Table<Playlist>>(null)
  const [editSong, setEditSong] = useState<Playlist | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<Playlist[]>([])
  const [showBatchDelete, setShowBatchDelete] = useState(false)

  const formOpen = showCreate || !!editSong

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

  const handleBatchDelete = async () => {
    const ids = selectedRows.map((row) => row.id)
    const result = await batchDeleteSongsAction(ids)
    if (result.success) {
      toast.success(`${result.data} songs deleted`)
      tableRef.current?.toggleAllRowsSelected(false)
    } else {
      toast.error(result.error)
    }
    setShowBatchDelete(false)
  }

  const handleCloseForm = () => {
    setShowCreate(false)
    setEditSong(null)
  }

  const handleSubmit = async (data: SongFormValues) => {
    const payload = {
      ...data,
      author: data.author
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    const result = editSong
      ? await updateSongAction(editSong.id, payload)
      : await createSongAction(payload)
    if (result.success) {
      handleCloseForm()
    } else {
      toast.error(result.error)
    }
  }

  const formDefaultValues: SongFormValues = {
    name: editSong?.name || '',
    author: editSong?.author.join(', ') || '',
    cover: editSong?.cover || '',
    url: editSong?.url || '',
    duration: editSong?.duration || ''
  }

  return (
    <Animated preset="fadeIn">
      <DataTable
        columns={columns}
        data={playlist}
        pagination
        rowKey="id"
        loading={!playlist.length}
        selectable
        onRowSelectionChange={setSelectedRows}
        tableRef={tableRef}
        actions={{
          className: 'w-24',
          render: (record) => (
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setEditSong(record)}
                className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(record.id)}
                className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        }}
        toolbar={{
          filterFields: [{ key: 'name', label: 'Name' }],
          filterMode: 'auto',
          actions: (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-8"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="mr-2 size-4" />
                Add Song
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8"
                disabled={selectedRows.length === 0}
                onClick={() => setShowBatchDelete(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </div>
          ),
          columnToggle: true,
          exportable: true
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={handleCloseForm}
        title={editSong ? 'Edit Song' : 'Add Song'}
        showFooter={false}
      >
        <Form
          schema={songFormSchema}
          fields={songFields}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete song"
        description="This will permanently remove the song from the playlist."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Batch Delete Confirm */}
      <Confirm
        open={showBatchDelete}
        onClose={() => setShowBatchDelete(false)}
        title="Batch delete songs"
        description={`This will permanently remove ${selectedRows.length} songs.`}
        variant="destructive"
        confirmText="Delete All"
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchDelete(false)}
      />
    </Animated>
  )
}
