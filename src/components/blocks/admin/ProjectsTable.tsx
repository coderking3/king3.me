'use client'

import type { Project } from '@/types'

import { FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteProjectAction } from '@/app/actions/projects'
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

import ProjectFormDialog from './ProjectFormDialog'

function ProjectsTable({ projects }: { projects: Project[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [showCreate, setShowCreate] = useState(false)

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

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Projects</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
          <FolderKanban size={48} className="mb-4 opacity-30" />
          <p>No projects yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Image
                    src={project.icon}
                    alt={project.name}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{project.name}</span>
                </TableCell>
                <TableCell>
                  <p className="text-muted-foreground max-w-xs truncate text-sm">
                    {project.description}
                  </p>
                </TableCell>
                <TableCell>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary max-w-[200px] truncate text-sm hover:underline"
                  >
                    {project.link}
                  </a>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {project.order}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditProject(project)}
                      className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(project.id)}
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

      <ProjectFormDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <ProjectFormDialog
        open={!!editProject}
        project={editProject}
        onClose={() => setEditProject(null)}
      />

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

export default ProjectsTable
