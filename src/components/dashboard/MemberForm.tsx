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
import { Switch } from "@/components/ui/switch"
import { DateField } from "@/components/dashboard/DateField"
import { fakeRequest, useDashboard } from "@/components/dashboard/store"
import { ROLES, type Member, type Role } from "@/lib/dashboard-types"

interface MemberFormProps {
  member?: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[0-9]{6,15}$/

export function MemberForm({ member, open, onOpenChange }: MemberFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        {/* El cuerpo se monta al abrir, así que su estado parte de los datos
            actuales del miembro sin necesidad de reiniciarlo con un efecto. */}
        <MemberFormBody member={member} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function MemberFormBody({
  member,
  onDone,
}: {
  member?: Member
  onDone: () => void
}) {
  const { projects, members, createMember, updateMember } = useDashboard()

  const [form, setForm] = useState({
    name: member?.name ?? "",
    email: member?.email ?? "",
    role: (member?.role ?? "") as Role | "",
    position: member?.position ?? "",
    birthdate: member?.birthdate ?? "",
    phone: member?.phone ?? "",
    projectId: member?.projectId ?? "",
    isActive: member?.isActive ?? true,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const validate = (): string[] => {
    const found: string[] = []
    if (form.name.trim().length < 3)
      found.push("El nombre debe tener al menos 3 caracteres.")
    if (!EMAIL_RE.test(form.email))
      found.push("El email no tiene un formato válido.")
    else if (
      members.some(
        (m) =>
          m.email.toLowerCase() === form.email.trim().toLowerCase() &&
          m.userId !== member?.userId
      )
    )
      found.push("Ya existe un miembro registrado con ese email.")
    if (!form.role) found.push("Selecciona un rol.")
    if (form.position.trim().length < 3)
      found.push("Indica el cargo del miembro.")
    if (!form.birthdate) found.push("Selecciona la fecha de nacimiento.")
    if (!PHONE_RE.test(form.phone))
      found.push("El teléfono debe contener solo números (6 a 15 dígitos).")
    if (!form.projectId) found.push("Asigna el miembro a un proyecto.")
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
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role as Role,
      position: form.position.trim(),
      birthdate: form.birthdate,
      phone: form.phone.trim(),
      projectId: form.projectId,
      isActive: form.isActive,
    }

    if (member) updateMember(member.userId, payload)
    else createMember(payload)

    onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {member ? "Editar Miembro" : "Nuevo Miembro del Equipo"}
        </DialogTitle>
        <DialogDescription>
          {member
            ? `Actualiza los datos de ${member.name} (${member.userId}).`
            : "Registra un nuevo integrante y asígnalo a un proyecto."}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="member-name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-name"
              placeholder="Nombre y apellido"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-email"
              type="email"
              placeholder="persona@empresa.pe"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-role">
              Rol <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm({ ...form, role: value as Role })
              }
            >
              <SelectTrigger id="member-role" className="w-full">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-position">
              Cargo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-position"
              placeholder="Frontend Developer"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </div>

          <DateField
            id="member-birthdate"
            label="Fecha de nacimiento"
            required
            withYearDropdown
            value={form.birthdate}
            onChange={(iso) => setForm({ ...form, birthdate: iso })}
          />

          <div className="grid gap-2">
            <Label htmlFor="member-phone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-phone"
              inputMode="numeric"
              placeholder="987654321"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="member-project">
            Proyecto asignado <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.projectId}
            onValueChange={(value) => setForm({ ...form, projectId: value })}
          >
            <SelectTrigger id="member-project" className="w-full">
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

        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <Label htmlFor="member-active">Miembro activo</Label>
            <p className="text-sm text-muted-foreground">
              Los miembros inactivos no se cuentan en las métricas.
            </p>
          </div>
          <Switch
            id="member-active"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              setForm({ ...form, isActive: checked })
            }
          />
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
          {saving ? "Guardando..." : member ? "Guardar cambios" : "Registrar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
