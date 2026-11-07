export const PROJECT_STATUSES = [
  "Planificado",
  "En progreso",
  "En revisión",
  "Completado",
] as const

export const TASK_STATUSES = ["Pendiente", "En progreso", "Completado"] as const

export const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"] as const

export const CATEGORIES = [
  { value: "web", label: "Desarrollo Web" },
  { value: "mobile", label: "Desarrollo Mobile" },
  { value: "design", label: "Diseño" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Otro" },
] as const

export const ROLES = ["Administrador", "Editor", "Lector"] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type TaskStatus = (typeof TASK_STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]
export type Category = (typeof CATEGORIES)[number]["value"]
export type Role = (typeof ROLES)[number]

export interface Project {
  id: string
  title: string
  description: string
  category: Category
  status: ProjectStatus
  priority: Priority
  progress: number
  startDate: string
  /** userId de los miembros asignados al proyecto. */
  members: string[]
}

export interface Member {
  userId: string
  role: Role
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  dateline: string
}

export interface ActivityEntry {
  id: string
  user: string
  action: string
  target: string
  /** Etiqueta fija para los registros de ejemplo (evita desajustes de hidratación). */
  label?: string
  at?: number
}

export interface Settings {
  organization: string
  notificationEmail: string
  timezone: string
  language: string
  theme: "light" | "dark"
  emailNotifications: boolean
  weeklyReport: boolean
  maintenanceMode: boolean
  tasksPerPage: number
}

/** Formatea un ISO yyyy-mm-dd como dd/mm/yyyy sin depender de la zona horaria. */
export function formatDate(iso: string): string {
  if (!iso) return "—"
  const [y, m, d] = iso.split("-")
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

/** Convierte un Date local a ISO yyyy-mm-dd sin desplazamiento por UTC. */
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Convierte un ISO yyyy-mm-dd a Date local (medianoche local). */
export function fromISODate(iso: string): Date | undefined {
  if (!iso) return undefined
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

/**
 * Etiqueta relativa entre dos instantes. `now` se recibe como parámetro para
 * que la función sea pura y no llame a Date.now() durante el render.
 */
export function relativeTime(at: number, now: number): string {
  const seconds = Math.floor((now - at) / 1000)
  if (seconds < 60) return "Hace unos segundos"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  return `Hace ${Math.floor(hours / 24)} d`
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}
