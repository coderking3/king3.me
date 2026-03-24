'use client'

import type { FieldConfig } from '@/components'
import type { Playlist } from '@/types'

import { z } from 'zod/v4'

import { createSongAction, updateSongAction } from '@/app/actions/playlist'
import { Form, Modal } from '@/components'

const songSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  author: z.string().min(1, 'Artist is required'),
  cover: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  url: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  duration: z
    .string()
    .regex(/^(\d{1,2}:)?\d{2}:\d{2}$|^$/, 'Format: MM:SS or HH:MM:SS')
})

const songFields: FieldConfig[] = [
  { name: 'name', label: 'Name' },
  { name: 'author', label: 'Artist (comma separated)' },
  { name: 'cover', label: 'Cover URL' },
  { name: 'url', label: 'Audio URL' },
  { name: 'duration', label: 'Duration (e.g. 03:52)' }
]

const defaultValues = { name: '', author: '', cover: '', url: '', duration: '' }

interface SongFormDialogProps {
  open: boolean
  song?: Playlist | null
  onClose: () => void
}

function SongFormDialog({ open, song, onClose }: SongFormDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={song ? 'Edit Song' : 'Add Song'}
      showFooter={false}
    >
      <Form
        schema={songSchema}
        fields={songFields}
        defaultValues={defaultValues}
        editValues={
          song
            ? {
                author: song.author.join(', '),
                name: song.name,
                cover: song.cover,
                url: song.url,
                duration: song.duration
              }
            : null
        }
        isEdit={!!song}
        onCancel={onClose}
        onSubmit={async (data) => {
          const payload = {
            ...data,
            author: data.author
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          }
          const result = song
            ? await updateSongAction(song.id, payload)
            : await createSongAction(payload)
          if (result.success) onClose()
          return result
        }}
      />
    </Modal>
  )
}

export default SongFormDialog
