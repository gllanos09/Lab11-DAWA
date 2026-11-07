"use client"

import { useMemo, useState } from "react"
import { PlusIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TaskForm } from "@/components/dashboard/TaskForm"
import { useDashboard } from "@/components/dashboard/store"
import {
  TASK_STATUSES,
  formatDate,
  type Task,
} from "@/lib/dashboard-types"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default" as const
    case "En progreso":
      return "secondary" as const
    case "Pendiente":
      return "outline" as const
    default:
      return "outline" as const
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive" as const
    case "Alta":
      return "default" as const
    case "Media":
      return "secondary" as const
    case "Baja":
      return "outline" as const
    default:
      return "outline" as const
  }
}

export function TasksTable() {
  const { tasks, settings, projectName, memberName, deleteTask } =
    useDashboard()

  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [toDelete, setToDelete] = useState<Task | null>(null)

  const perPage = settings.tasksPerPage

  const filtered = useMemo(
    () =>
      statusFilter === "todos"
        ? tasks
        : tasks.filter((t) => t.status === statusFilter),
    [tasks, statusFilter]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  // Si al borrar o filtrar la página deja de existir, se muestra la última.
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const allVisibleSelected =
    visible.length > 0 && visible.every((t) => selected.includes(t.id))

  const toggleAllVisible = () => {
    setSelected((prev) =>
      allVisibleSelected
        ? prev.filter((id) => !visible.some((t) => t.id === id))
        : [...new Set([...prev, ...visible.map((t) => t.id)])]
    )
  }

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const goTo = (target: number) => {
    setPage(Math.min(Math.max(1, target), totalPages))
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filtered.length} tarea{filtered.length === 1 ? "" : "s"}
            {selected.length > 0 && ` · ${selected.length} seleccionada(s)`}
          </span>
        </div>
        <Button onClick={() => setCreating(true)}>
          <PlusIcon data-icon="inline-start" />
          Nueva Tarea
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Mostrando {visible.length} de {filtered.length} tareas · página{" "}
            {currentPage} de {totalPages}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={toggleAllVisible}
                  aria-label="Seleccionar todas las tareas visibles"
                />
              </TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(task.id)}
                    onCheckedChange={() => toggleOne(task.id)}
                    aria-label={`Seleccionar ${task.description}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {task.description}
                </TableCell>
                <TableCell>{projectName(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>{memberName(task.userId)}</TableCell>
                <TableCell>{formatDate(task.dateline)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(task)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setToDelete(task)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay tareas que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Anterior"
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
                onClick={(e) => {
                  e.preventDefault()
                  goTo(currentPage - 1)
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={n === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(n)
                  }}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                text="Siguiente"
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                onClick={(e) => {
                  e.preventDefault()
                  goTo(currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <TaskForm open={creating} onOpenChange={setCreating} />

      {editing && (
        <TaskForm
          task={editing}
          open={editing !== null}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará «{toDelete?.description}». Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  deleteTask(toDelete.id)
                  setSelected((prev) => prev.filter((id) => id !== toDelete.id))
                }
                setToDelete(null)
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
