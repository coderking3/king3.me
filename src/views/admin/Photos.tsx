'use client'

import type { ColumnConfig, FormFieldConfig } from '@/components'
import type { PhotoInput } from '@/lib/schemas'
import type { Photo } from '@/types'

import { FileJson, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  batchCreatePhotosAction,
  createPhotoAction,
  deletePhotoAction
} from '@/app/actions/photos'
import { Animated, Confirm, DataTable, Form, Modal } from '@/components'
import { Button, DialogClose, DialogFooter, Textarea } from '@/components/ui'
import { photoSchema } from '@/lib/schemas'

// ──── Form Config ────

const photoFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  url: z.url('Please enter a valid URL'),
  width: z.coerce.number().int().positive('Width must be positive'),
  height: z.coerce.number().int().positive('Height must be positive'),
  date: z.string().min(1, 'Date is required')
})

type PhotoFormValues = z.infer<typeof photoFormSchema>

const photoFields: FormFieldConfig<PhotoFormValues>[] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'Photo name' },
  {
    name: 'url',
    label: 'Image URL',
    type: 'input',
    placeholder: 'https://...'
  },
  { name: 'width', label: 'Width', type: 'input', placeholder: 'e.g. 1920' },
  { name: 'height', label: 'Height', type: 'input', placeholder: 'e.g. 1080' },
  { name: 'date', label: 'Date', type: 'input', placeholder: 'e.g. 2025-06-07' }
]

// ──── Table Columns ────

const columns: ColumnConfig<Photo>[] = [
  {
    key: 'url',
    title: 'Preview',
    render: (_, record) => (
      <Image
        src={`${record.url}@80w_80h_1e_1c.webp`}
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
    key: 'width',
    title: 'Dimensions',
    render: (_, record) => (
      <span className="text-muted-foreground text-sm">
        {record.width} x {record.height}
      </span>
    )
  },
  {
    key: 'date',
    title: 'Date',
    sortable: true,
    render: (value) => (
      <span className="text-muted-foreground text-xs">
        {new Date(value).toLocaleDateString()}
      </span>
    )
  }
]

// ──── Component ────

export default function PhotosAdmin({ photos }: { photos: Photo[] }) {
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deletePhotoAction(deleteId)
    if (result.success) {
      toast.success('Photo deleted')
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  const handleCreateSubmit = async (data: PhotoFormValues) => {
    const payload: PhotoInput = {
      ...data,
      width: Number(data.width),
      height: Number(data.height),
      date: new Date(data.date)
    }
    const result = await createPhotoAction(payload)
    if (result.success) {
      toast.success('Photo added')
      setShowCreate(false)
    } else {
      toast.error(result.error)
    }
  }

  const handleImport = async () => {
    setImportLoading(true)
    try {
      const raw = JSON.parse(importJson)
      const items: PhotoInput[] = (Array.isArray(raw) ? raw : [raw]).map(
        (item: Record<string, unknown>) =>
          photoSchema.parse({
            name: item.name,
            url: item.url,
            width: item.width,
            height: item.height,
            date: item.date ? new Date(item.date as number) : new Date()
          })
      )
      const result = await batchCreatePhotosAction(items)
      if (result.success) {
        toast.success(`Imported ${result.data} photos`)
        setShowImport(false)
        setImportJson('')
      } else {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid JSON format')
    }
    setImportLoading(false)
  }

  const createDefaultValues: PhotoFormValues = {
    name: '',
    url: '',
    width: 0,
    height: 0,
    date: new Date().toISOString().split('T')[0]
  }

  return (
    <Animated preset="fadeIn">
      <DataTable
        columns={columns}
        data={photos}
        pagination
        rowKey="id"
        loading={photos === undefined}
        selectable
        actions={{
          className: 'w-20',
          render: (record) => (
            <div className="flex items-center justify-center">
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
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus size={16} />
                Add Photo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowImport(true)}
              >
                <FileJson size={16} />
                Import JSON
              </Button>
            </div>
          ),
          columnToggle: true
        }}
      />

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Photo"
        showFooter={false}
      >
        <Form
          schema={photoFormSchema}
          fields={photoFields}
          defaultValues={createDefaultValues}
          onSubmit={handleCreateSubmit}
        />
      </Modal>

      {/* Import JSON Modal */}
      <Modal
        open={showImport}
        onClose={() => {
          setShowImport(false)
          setImportJson('')
        }}
        title="Import Photos from JSON"
        renderFooter={() => (
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" />}
              onClick={() => {
                setShowImport(false)
                setImportJson('')
              }}
            >
              Cancel
            </DialogClose>
            <Button
              onClick={handleImport}
              disabled={!importJson.trim() || importLoading}
            >
              {importLoading ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        )}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Paste a JSON array with objects containing: name, url, width, height
          </p>
          <Textarea
            rows={10}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='[{ "name": "...", "url": "https://...", "width": 1920, "height": 1080 }]'
            className="max-h-[40vh] w-full min-w-0 overflow-y-auto font-mono text-xs break-all"
          />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete photo"
        description="This will permanently remove the photo."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Animated>
  )
}
