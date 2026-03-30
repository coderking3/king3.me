'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnConfig } from '@/components/common'
import type { Project } from '@/types'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction
} from '@/app/actions/projects'
import { Confirm, DataTable, Form, Modal } from '@/components/common'
import { Button } from '@/components/ui'

// ──── Form Config ────

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  link: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  icon: z.union([z.url('Please enter a valid URL'), z.literal('')])
})

type ProjectFormValues = z.infer<typeof projectSchema>

const projectFields: Parameters<typeof Form<ProjectFormValues>>[0]['fields'] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'Project name' },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Project description'
  },
  { name: 'link', label: 'Link', type: 'input', placeholder: 'https://...' },
  { name: 'icon', label: 'Icon URL', type: 'input', placeholder: 'https://...' }
]

// ──── Table Columns ────

const columns: ColumnConfig<Project>[] = [
  {
    key: 'icon',
    title: 'Icon',
    render: (_, record) => (
      <Image
        src={record.icon}
        alt={record.name}
        width={32}
        height={32}
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
    key: 'description',
    title: 'Description',
    render: (value) => (
      <p className="text-muted-foreground max-w-xs truncate text-sm">{value}</p>
    )
  },
  {
    key: 'link',
    title: 'Link',
    render: (value) => (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary max-w-[200px] truncate text-sm hover:underline"
      >
        {value}
      </a>
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

export default function Projects({ projects }: { projects: Project[] }) {
  const tableRef = useRef<Table<Project>>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const formOpen = showCreate || !!editProject

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteProjectAction(deleteId)
    if (result.success) {
      toast.success('Project deleted')
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  const handleCloseForm = () => {
    setShowCreate(false)
    setEditProject(null)
  }

  const handleSubmit = async (data: ProjectFormValues) => {
    const result = editProject
      ? await updateProjectAction(editProject.id, data)
      : await createProjectAction(data)
    if (result.success) {
      handleCloseForm()
    } else {
      toast.error(result.error)
    }
  }

  const formDefaultValues: ProjectFormValues = {
    name: editProject?.name || '',
    description: editProject?.description || '',
    link: editProject?.link || '',
    icon: editProject?.icon || ''
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={projects}
        pagination
        rowKey="id"
        loading={!projects.length}
        selectable
        tableRef={tableRef}
        actions={{
          className: 'w-24',
          render: (record) => (
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setEditProject(record)}
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
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus size={16} />
                New
              </Button>
            </div>
          ),
          columnToggle: true
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={handleCloseForm}
        title={editProject ? 'Edit Project' : 'Add Project'}
        showFooter={false}
      >
        <Form
          schema={projectSchema}
          fields={projectFields}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete project"
        description="This will permanently remove the project."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}
