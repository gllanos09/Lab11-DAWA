"use client"

import { useState } from "react"
import { PencilIcon, Trash2Icon, UsersIcon } from "lucide-react"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ProjectForm } from "@/components/ProjectForm"
import { useDashboard } from "@/components/dashboard/store"
import {
  categoryLabel,
  formatDate,
  type Project,
} from "@/lib/dashboard-types"

function statusVariant(status: string) {
  switch (status) {
    case "Completado":
      return "default" as const
    case "En revisión":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

export function ProjectsTab() {
  const { projects, tasks, memberName, deleteProject } = useDashboard()
  const [details, setDetails] = useState<Project | null>(null)
  const [editing, setEditing] = useState<Project | null>(null)
  const [toDelete, setToDelete] = useState<Project | null>(null)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={statusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    {project.members.length} miembros
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDetails(project)}
                    >
                      Ver detalles
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Editar ${project.title}`}
                      onClick={() => setEditing(project)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      aria-label={`Eliminar ${project.title}`}
                      onClick={() => setToDelete(project)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-10 text-center text-muted-foreground">
              No hay proyectos registrados. Usa “Nuevo Proyecto” para crear uno.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ver detalles */}
      <Dialog
        open={details !== null}
        onOpenChange={(open) => !open && setDetails(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>{details.title}</DialogTitle>
                <DialogDescription>{details.description}</DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-y-3 py-4 text-sm">
                <dt className="text-muted-foreground">Código</dt>
                <dd className="font-medium">{details.id}</dd>
                <dt className="text-muted-foreground">Categoría</dt>
                <dd className="font-medium">
                  {categoryLabel(details.category)}
                </dd>
                <dt className="text-muted-foreground">Estado</dt>
                <dd>
                  <Badge variant={statusVariant(details.status)}>
                    {details.status}
                  </Badge>
                </dd>
                <dt className="text-muted-foreground">Prioridad</dt>
                <dd className="font-medium">{details.priority}</dd>
                <dt className="text-muted-foreground">Fecha de inicio</dt>
                <dd className="font-medium">{formatDate(details.startDate)}</dd>
                <dt className="text-muted-foreground">Progreso</dt>
                <dd className="font-medium">{details.progress}%</dd>
              </dl>

              <Separator />

              <div className="py-4">
                <h4 className="mb-2 text-sm font-semibold">
                  Equipo asignado ({details.members.length})
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {details.members.map((userId) => (
                    <li key={userId}>• {memberName(userId)}</li>
                  ))}
                  {details.members.length === 0 && <li>Sin miembros.</li>}
                </ul>
              </div>

              <Separator />

              <div className="py-4">
                <h4 className="mb-2 text-sm font-semibold">
                  Tareas del proyecto (
                  {tasks.filter((t) => t.projectId === details.id).length})
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {tasks
                    .filter((t) => t.projectId === details.id)
                    .map((task) => (
                      <li key={task.id}>
                        • {task.description} — {task.status}
                      </li>
                    ))}
                  {tasks.filter((t) => t.projectId === details.id).length ===
                    0 && <li>Sin tareas registradas.</li>}
                </ul>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetails(null)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Editar */}
      {editing && (
        <ProjectForm
          project={editing}
          withTrigger={false}
          open={editing !== null}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}

      {/* Eliminar */}
      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará «{toDelete?.title}» y sus tareas asociadas. Los
              miembros del equipo se conservan, pero quedarán sin proyecto
              asignado. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteProject(toDelete.id)
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
