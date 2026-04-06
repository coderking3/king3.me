import type { DragEndEvent } from '@dnd-kit/core'

import { closestCenter, DndContext } from '@dnd-kit/core'

interface DraggableTableProps {
  sensors: Parameters<typeof DndContext>[0]['sensors']
  onDragEnd: (event: DragEndEvent) => void
  children: React.ReactNode
}

export function DraggableTable({
  sensors,
  onDragEnd,
  children
}: DraggableTableProps) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  )
}
