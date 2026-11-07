"use client"

import { useState } from "react"
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { DateField } from "@/components/dashboard/DateField"
import { fakeRequest, useDashboard } from "@/components/dashboard/store"
import {
  PRIORITIES,
  TASK_STATUSES,
  type Priority,
  type Task,
  type TaskStatus,
} from "@/lib/dashboard-types"

interface TaskFormProps {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskForm({ task, open, onOpenChange }: TaskFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        {/* El cuerpo se monta al abrir el diálogo: su estado inicial siempre
            refleja la tarea que se está editando. */}
        <TaskFormBody task={task} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function TaskFormBody({ task, onDone }: { task?: Task; onDone: () => void }) {
  const { projects, members, createTask, updateTask } = useDashboard()

  const [form, setForm] = useState({
    description: task?.description ?? "",
    projectId: task?.projectId ?? "",
    status: (task?.status ?? "Pendiente") as TaskStatus,
    priority: (task?.priority ?? "") as Priority | "",
    userId: task?.userId ?? "",
    dateline: task?.dateline ?? "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const validate = (): string[] => {
    const found: string[] = []
    if (form.description.trim().length < 5)
      found.push("La descripción debe tener al menos 5 caracteres.")
    if (!form.projectId) found.push("Selecciona el proyecto.")
    if (!form.priority) found.push("Selecciona la prioridad.")
    if (!form.userId) found.push("Asigna la tarea a un miembro del equipo.")
    if (!form.dateline) found.push("Selecciona la fecha límite.")
    return found
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.length > 0) return

    setSaving(true)
    await fakeRequest()

    const payload = {
      description: form.description.trim(),
      projectId: form.projectId,
      status: form.status,
      priority: form.priority as Priority,
      userId: form.userId,
      dateline: form.dateline,
    }

    if (task) updateTask(task.id, payload)
    else createTask(payload)

    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{task ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
        <DialogDescription>
          {task
            ? `Actualiza los datos de la tarea ${task.id}.`
            : "Registra una tarea y asígnala a un responsable."}
        </DialogDescription>
      </DialogHeader>

      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircleIcon />
          <AlertTitle>Revisa el formulario</AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="task-description">
            Descripción <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="task-description"
            placeholder="Implementar autenticación con JWT"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="task-project">
              Proyecto <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.projectId}
              onValueChange={(value) => setForm({ ...form, projectId: value })}
            >
              <SelectTrigger id="task-project" className="w-full">
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-user">
              Responsable <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.userId}
              onValueChange={(value) => setForm({ ...form, userId: value })}
            >
              <SelectTrigger id="task-user" className="w-full">
                <SelectValue placeholder="Selecciona un responsable" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-status">Estado</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({ ...form, status: value as TaskStatus })
              }
            >
              <SelectTrigger id="task-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-priority">
              Prioridad <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.priority}
              onValueChange={(value) =>
                setForm({ ...form, priority: value as Priority })
              }
            >
              <SelectTrigger id="task-priority" className="w-full">
                <SelectValue placeholder="Selecciona la prioridad" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DateField
          id="task-dateline"
          label="Fecha límite"
          required
          value={form.dateline}
          onChange={(iso) => setForm({ ...form, dateline: iso })}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Spinner data-icon="inline-start" />}
          {saving ? "Guardando..." : task ? "Guardar cambios" : "Crear Tarea"}
        </Button>
      </DialogFooter>
    </form>
  )
}
