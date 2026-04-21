'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnConfig, FormFieldConfig } from '@/components'
import type { PhotoInput } from '@/lib/schemas'
import type { Photo } from '@/types'

import { formatDate } from 'kedash'
import { FileJson, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  batchCreatePhotosAction,
  batchDeletePhotosAction,
  createPhotoAction,
  deletePhotoAction,
  updatePhotoAction
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
  date: z.coerce.date()
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
  { name: 'date', label: 'Date', type: 'date' }
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
        {formatDate(value, 'yyyy-MM-dd')}
      </span>
    )
  }
]

// ──── Component ────

export default function PhotosAdmin({ photos }: { photos: Photo[] }) {
  const tableRef = useRef<Table<Photo>>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<Photo[]>([])
  const [showBatchDelete, setShowBatchDelete] = useState(false)

  const formOpen = showCreate || !!editPhoto

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

  const handleBatchDelete = async () => {
    const ids = selectedRows.map((row) => row.id)
    const result = await batchDeletePhotosAction(ids)
    if (result.success) {
      toast.success(`${result.data} photos deleted`)
      tableRef.current?.toggleAllRowsSelected(false)
    } else {
      toast.error(result.error)
    }
    setShowBatchDelete(false)
  }

  const handleCloseForm = () => {
    setShowCreate(false)
    setEditPhoto(null)
  }

  const handleSubmit = async (data: PhotoFormValues) => {
    const payload: PhotoInput = {
      ...data,
      width: Number(data.width),
      height: Number(data.height),
      date: data.date
    }
    const result = editPhoto
      ? await updatePhotoAction(editPhoto.id, payload)
      : await createPhotoAction(payload)
    if (result.success) {
      toast.success(editPhoto ? 'Photo updated' : 'Photo added')
      handleCloseForm()
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

  const formDefaultValues: PhotoFormValues = {
    name: editPhoto?.name || '',
    url: editPhoto?.url || '',
    width: editPhoto?.width || 0,
    height: editPhoto?.height || 0,
    date: editPhoto ? new Date(editPhoto.date) : new Date()
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
        onRowSelectionChange={setSelectedRows}
        tableRef={tableRef}
        actions={{
          className: 'w-24',
          render: (record) => (
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setEditPhoto(record)}
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
                Add Photo
              </Button>
              <Button
                size="sm"
                className="h-8"
                variant="outline"
                onClick={() => setShowImport(true)}
              >
                <FileJson className="mr-2 size-4" />
                Import
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
        title={editPhoto ? 'Edit Photo' : 'Add Photo'}
        showFooter={false}
      >
        <Form
          schema={photoFormSchema}
          fields={photoFields}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
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

      {/* Batch Delete Confirm */}
      <Confirm
        open={showBatchDelete}
        onClose={() => setShowBatchDelete(false)}
        title="Batch delete photos"
        description={`This will permanently remove ${selectedRows.length} photos.`}
        variant="destructive"
        confirmText="Delete All"
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchDelete(false)}
      />
    </Animated>
  )
}
