'use client'

import type { ColumnConfig } from '@/components/common'
import type { Project } from '@/types'

import { FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction
} from '@/app/actions/projects'
import { Form, Modal } from '@/components/common'
import { TestDataTable } from '@/components/common/TestDataTable'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button
} from '@/components/ui'

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

function getColumns(
  onEdit: (project: Project) => void,
  onDelete: (id: string) => void
): ColumnConfig<Project>[] {
  return [
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
        <p className="text-muted-foreground max-w-xs truncate text-sm">
          {value}
        </p>
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
      render: (value) => (
        <span className="text-muted-foreground text-sm">{value}</span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      className: 'w-24',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(record.id)}
            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]
}

// ──── Component ────

export default function Projects({ projects }: { projects: Project[] }) {
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

  const columns = getColumns(setEditProject, setDeleteId)

  const formDefaultValues: ProjectFormValues = {
    name: editProject?.name || '',
    description: editProject?.description || '',
    link: editProject?.link || '',
    icon: editProject?.icon || ''
  }

  return (
    <>
      {projects.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
          <FolderKanban size={48} className="mb-4 opacity-30" />
          <p>No projects yet</p>
        </div>
      ) : (
        // <DataTable pagination={true} columns={columns} data={projects} />
        <TestDataTable
          columns={columns}
          data={projects}
          pagination
          rowKey="id"
          selectable
          toolbar={{
            filterFields: [{ key: 'name', label: 'Name' }],
            actions: (
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus size={16} />
                New
              </Button>
            ),
            columnToggle: true
          }}
          // eslint-disable-next-line no-console
          onFilter={(values) => console.log(values)}
          // eslint-disable-next-line no-console
          onSelectionChange={(rows) => console.log('selected:', rows)}
        />
      )}

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
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the project.
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
