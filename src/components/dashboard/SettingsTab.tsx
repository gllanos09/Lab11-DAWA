"use client"

import { useState } from "react"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { fakeRequest, useDashboard } from "@/components/dashboard/store"
import type { Settings } from "@/lib/dashboard-types"

const TIMEZONES = [
  "America/Lima",
  "America/Bogota",
  "America/Mexico_City",
  "America/Buenos_Aires",
  "Europe/Madrid",
]

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function SettingsTab() {
  const { settings, saveSettings } = useDashboard()
  // El formulario es la única fuente de edición: parte de la configuración
  // vigente y solo vuelve a sincronizarse cuando se descartan los cambios.
  const [form, setForm] = useState<Settings>(settings)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const validate = (): string[] => {
    const found: string[] = []
    if (form.organization.trim().length < 3)
      found.push("El nombre de la organización debe tener al menos 3 caracteres.")
    if (!EMAIL_RE.test(form.notificationEmail))
      found.push("El email de notificaciones no tiene un formato válido.")
    if (form.tasksPerPage < 3 || form.tasksPerPage > 20)
      found.push("Las tareas por página deben estar entre 3 y 20.")
    return found
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    setSaved(false)
    if (found.length > 0) return

    setSaving(true)
    await fakeRequest()
    saveSettings({ ...form, organization: form.organization.trim() })
    setSaving(false)
    setSaved(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>
          Administra las preferencias de tu cuenta. Los cambios se aplican sobre
          los datos en memoria del Dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>No se pudo guardar</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {saved && (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Configuración guardada</AlertTitle>
              <AlertDescription>
                Las preferencias se aplicaron correctamente.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="organization">Organización</Label>
              <Input
                id="organization"
                value={form.organization}
                onChange={(e) => update("organization", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notificationEmail">
                Email de notificaciones
              </Label>
              <Input
                id="notificationEmail"
                type="email"
                value={form.notificationEmail}
                onChange={(e) => update("notificationEmail", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timezone">Zona horaria</Label>
              <Select
                value={form.timezone}
                onValueChange={(value) => update("timezone", value)}
              >
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={form.language}
                onValueChange={(value) => update("language", value)}
              >
                <SelectTrigger id="language" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="theme">Apariencia</Label>
              <Select
                value={form.theme}
                onValueChange={(value) =>
                  update("theme", value as Settings["theme"])
                }
              >
                <SelectTrigger id="theme" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Tema claro</SelectItem>
                  <SelectItem value="dark">Tema oscuro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tasksPerPage">Tareas por página</Label>
              <Select
                value={String(form.tasksPerPage)}
                onValueChange={(value) =>
                  update("tasksPerPage", Number(value))
                }
              >
                <SelectTrigger id="tasksPerPage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 8, 10, 20].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            {(
              [
                {
                  key: "emailNotifications",
                  label: "Notificaciones por email",
                  help: "Enviar un correo cuando cambie el estado de una tarea.",
                },
                {
                  key: "weeklyReport",
                  label: "Reporte semanal",
                  help: "Resumen de avance cada lunes a las 08:00.",
                },
                {
                  key: "maintenanceMode",
                  label: "Modo mantenimiento",
                  help: "Bloquea la edición para el resto del equipo.",
                },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <Label htmlFor={item.key}>{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.help}</p>
                </div>
                <Switch
                  id={item.key}
                  checked={form[item.key]}
                  onCheckedChange={(checked) => update(item.key, checked)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm(settings)
                setErrors([])
                setSaved(false)
              }}
              disabled={saving}
            >
              Descartar cambios
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner data-icon="inline-start" />}
              {saving ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
