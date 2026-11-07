"use client"

import { useState } from "react"
import { AlertCircleIcon, PlusIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
  CATEGORIES,
  PRIORITIES,
  PROJECT_STATUSES,
  type Category,
  type Priority,
  type Project,
  type ProjectStatus,
} from "@/lib/dashboard-types"

interface ProjectFormProps {
  /** Si se recibe, el diálogo edita ese proyecto en lugar de crear uno nuevo. */
  project?: Project
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Cuando se controla desde fuera no se renderiza el botón disparador. */
  withTrigger?: boolean
}

export function ProjectForm({
  project,
  open: controlledOpen,
  onOpenChange,
  withTrigger = true,
}: ProjectFormProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {withTrigger && (
        <DialogTrigger asChild>
          <Button>
            <PlusIcon data-icon="inline-start" />
            Nuevo Proyecto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        {/* El cuerpo se monta al abrir el diálogo, por lo que su estado parte
            siempre de los datos actuales: no hace falta reiniciarlo a mano. */}
        <ProjectFormBody project={project} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ProjectFormBody({
  project,
  onDone,
}: {
  project?: Project
  onDone: () => void
}) {
  const { members, createProject, updateProject } = useDashboard()

  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    category: (project?.category ?? "") as Category | "",
    status: (project?.status ?? "Planificado") as ProjectStatus,
    priority: (project?.priority ?? "") as Priority | "",
    progress: String(project?.progress ?? 0),
    startDate: project?.startDate ?? "",
    members: [...(project?.members ?? [])],
  })
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const toggleMember = (userId: string) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId],
    }))
  }

  const validate = (): string[] => {
    const found: string[] = []
    if (form.title.trim().length < 3)
      found.push("El nombre del proyecto debe tener al menos 3 caracteres.")
    if (!form.category) found.push("Selecciona una categoría.")
    if (!form.priority) found.push("Selecciona la prioridad.")
    if (!form.startDate) found.push("Selecciona la fecha de inicio.")
    const progress = Number(form.progress)
    if (Number.isNaN(progress) || progress < 0 || progress > 100)
      found.push("El progreso debe ser un número entre 0 y 100.")
    if (form.members.length === 0)
      found.push("Asigna al menos un miembro del equipo.")
    return found
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.length > 0) return

    // Se simula la petición al backend mientras se muestra el Spinner.
    setSaving(true)
    await fakeRequest()

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category as Category,
      status: form.status,
      priority: form.priority as Priority,
      progress: Number(form.progress),
      startDate: form.startDate,
      members: form.members,
    }

    if (project) updateProject(project.id, payload)
    else createProject(payload)

    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {project ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
        </DialogTitle>
        <DialogDescription>
          Completa la información del proyecto. Click en guardar cuando
          termines.
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
          <Label htmlFor="name">
            Nombre del Proyecto <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Mi Proyecto Increíble"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Breve descripción del proyecto..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="category">
              Categoría <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm({ ...form, category: value as Category })
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">
              Prioridad <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.priority}
              onValueChange={(value) =>
                setForm({ ...form, priority: value as Priority })
              }
            >
              <SelectTrigger id="priority" className="w-full">
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

          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({ ...form, status: value as ProjectStatus })
              }
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="progress">Progreso (%)</Label>
            <Input
              id="progress"
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
            />
          </div>
        </div>

        <DateField
          id="startDate"
          label="Fecha de inicio"
          required
          value={form.startDate}
          onChange={(iso) => setForm({ ...form, startDate: iso })}
        />

        <div className="grid gap-2">
          <Label>
            Miembros del equipo <span className="text-destructive">*</span>
          </Label>
          <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
            {members.map((member) => (
              <label
                key={member.userId}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={form.members.includes(member.userId)}
                  onCheckedChange={() => toggleMember(member.userId)}
                />
                <span>
                  {member.name}
                  <span className="block text-xs text-muted-foreground">
                    {member.position}
                  </span>
                </span>
              </label>
            ))}
            {members.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no hay miembros registrados.
              </p>
            )}
          </div>
        </div>
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
          {saving
            ? "Guardando..."
            : project
              ? "Guardar cambios"
              : "Crear Proyecto"}
        </Button>
      </DialogFooter>
    </form>
  )
}
