'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnConfig, FormFieldConfig } from '@/components'
import type { PoemInput } from '@/lib/schemas'
import type { Poem } from '@/types'

import { format } from 'date-fns'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  batchDeletePoemsAction,
  createPoemAction,
  deletePoemAction,
  updatePoemAction
} from '@/actions/poems'
import { Animated, Confirm, DataTable, Form, Modal } from '@/components'
import { Button } from '@/components/ui'
import { poemSchema } from '@/lib/schemas'

// ──── Form Config ────

const poemFields: FormFieldConfig<PoemInput>[] = [
  { name: 'title', label: 'Title', type: 'input', placeholder: 'Poem title' },
  {
    name: 'author',
    label: 'Author',
    type: 'input',
    placeholder: 'e.g. 李白'
  },
  {
    name: 'content',
    label: 'Content',
    type: 'textarea',
    placeholder: 'Poem content...',
    rows: 8
  },
  { name: 'date', label: 'Date', type: 'date' }
]

// ──── Table Columns ────

const columns: ColumnConfig<Poem>[] = [
  {
    key: 'title',
    title: 'Title',
    sortable: true,
    render: (value) => <span className="text-sm font-medium">{value}</span>
  },
  {
    key: 'author',
    title: 'Author',
    sortable: true,
    render: (value) => (
      <span className="text-muted-foreground text-sm">{value}</span>
    )
  },
  {
    key: 'content',
    title: 'Content',
    render: (value) => (
      <p className="text-muted-foreground max-w-xs truncate text-sm">{value}</p>
    )
  },
  {
    key: 'date',
    title: 'Date',
    sortable: true,
    render: (value) => (
      <span className="text-muted-foreground text-xs">
        {format(value, 'yyyy-MM-dd')}
      </span>
    )
  }
]

// ──── Component ────

interface PoemsAdminProps {
  poems?: Poem[]
}

const DEFAULT_POEMS: Poem[] = []

export default function PoemsAdmin(props: PoemsAdminProps) {
  const { poems = DEFAULT_POEMS } = props
  const tableRef = useRef<Table<Poem>>(null)
  const [editPoem, setEditPoem] = useState<Poem | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<Poem[]>([])
  const [showBatchDelete, setShowBatchDelete] = useState(false)

  const formOpen = showCreate || !!editPoem

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deletePoemAction(deleteId)
    if (result.success) {
      toast.success('Poem deleted')
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  const handleBatchDelete = async () => {
    const ids = selectedRows.map((row) => row.id)
    const result = await batchDeletePoemsAction(ids)
    if (result.success) {
      toast.success(`${result.data} poems deleted`)
      tableRef.current?.toggleAllRowsSelected(false)
    } else {
      toast.error(result.error)
    }
    setShowBatchDelete(false)
  }

  const handleCloseForm = () => {
    setShowCreate(false)
    setEditPoem(null)
  }

  const handleSubmit = async (data: PoemInput) => {
    const result = editPoem
      ? await updatePoemAction(editPoem.id, data)
      : await createPoemAction(data)
    if (result.success) {
      toast.success(editPoem ? 'Poem updated' : 'Poem created')
      handleCloseForm()
    } else {
      toast.error(result.error)
    }
  }

  const formDefaultValues: PoemInput = {
    title: editPoem?.title || '',
    author: editPoem?.author || '',
    content: editPoem?.content || '',
    date: editPoem ? new Date(editPoem.date) : new Date()
  }

  return (
    <Animated preset="fadeIn">
      <DataTable
        columns={columns}
        data={poems}
        pagination
        rowKey="id"
        loading={poems === undefined}
        selectable
        onRowSelectionChange={setSelectedRows}
        tableRef={tableRef}
        actions={{
          className: 'w-24',
          render: (record) => (
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setEditPoem(record)}
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
          filterFields: [
            { key: 'title', label: 'Title' },
            { key: 'author', label: 'Author' }
          ],
          filterMode: 'auto',
          actions: (
            <>
              <Button
                size="sm"
                className="h-8"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="mr-2 size-4" />
                Create
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
            </>
          ),
          columnToggle: true,
          exportable: true
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={handleCloseForm}
        title={editPoem ? 'Edit Poem' : 'Add Poem'}
        showFooter={false}
      >
        <Form
          schema={poemSchema}
          fields={poemFields}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete poem"
        description="This will permanently remove the poem."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Batch Delete Confirm */}
      <Confirm
        open={showBatchDelete}
        onClose={() => setShowBatchDelete(false)}
        title="Batch delete poems"
        description={`This will permanently remove ${selectedRows.length} poems.`}
        variant="destructive"
        confirmText="Delete All"
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchDelete(false)}
      />
    </Animated>
  )
}
