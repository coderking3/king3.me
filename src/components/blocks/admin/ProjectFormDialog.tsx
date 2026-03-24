'use client'

import type { FieldConfig } from '@/components'
import type { Project } from '@/types'

import { z } from 'zod/v4'

import {
  createProjectAction,
  updateProjectAction
} from '@/app/actions/projects'
import { Form, Modal } from '@/components'

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  link: z.union([z.url('Please enter a valid URL'), z.literal('')]),
  icon: z.union([z.url('Please enter a valid URL'), z.literal('')])
})

const projectFields: FieldConfig[] = [
  { name: 'name', label: 'Name' },
  { name: 'description', label: 'Description' },
  { name: 'link', label: 'Link' },
  { name: 'icon', label: 'Icon URL' }
]

const defaultValues = { name: '', description: '', link: '', icon: '' }

interface ProjectFormDialogProps {
  open: boolean
  project?: Project | null
  onClose: () => void
}

function ProjectFormDialog({ open, project, onClose }: ProjectFormDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add Project'}
      showFooter={false}
    >
      <Form
        schema={projectSchema}
        fields={projectFields}
        defaultValues={defaultValues}
        editValues={
          project
            ? {
                name: project.name,
                description: project.description,
                link: project.link,
                icon: project.icon
              }
            : null
        }
        isEdit={!!project}
        onCancel={onClose}
        onSubmit={async (data) => {
          const result = project
            ? await updateProjectAction(project.id, data)
            : await createProjectAction(data)
          if (result.success) onClose()
          return result
        }}
      />
    </Modal>
  )
}

export default ProjectFormDialog
