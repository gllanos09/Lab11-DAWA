"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  ActivityEntry,
  Member,
  Project,
  Settings,
  Task,
} from "@/lib/dashboard-types"

/* -------------------------------------------------------------------------- */
/*  Datos iniciales en memoria                                                */
/* -------------------------------------------------------------------------- */

const SEED_PROJECTS: Project[] = [
  {
    id: "P-001",
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    status: "En progreso",
    priority: "Alta",
    progress: 65,
    startDate: "2026-07-01",
    members: ["U-001", "U-002"],
  },
  {
    id: "P-002",
    title: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    status: "En revisión",
    priority: "Media",
    progress: 90,
    startDate: "2026-05-12",
    members: ["U-003"],
  },
  {
    id: "P-003",
    title: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones",
    category: "web",
    status: "Planificado",
    priority: "Media",
    progress: 20,
    startDate: "2026-09-02",
    members: ["U-005"],
  },
  {
    id: "P-004",
    title: "API Gateway",
    description: "Microservicios con Node.js",
    category: "other",
    status: "En progreso",
    priority: "Urgente",
    progress: 45,
    startDate: "2026-06-18",
    members: ["U-004", "U-002"],
  },
  {
    id: "P-005",
    title: "Design System",
    description: "Librería de componentes reutilizables",
    category: "design",
    status: "Completado",
    priority: "Baja",
    progress: 100,
    startDate: "2026-03-04",
    members: ["U-003", "U-001"],
  },
  {
    id: "P-006",
    title: "Marketing Website",
    description: "Sitio web institucional",
    category: "marketing",
    status: "En progreso",
    priority: "Media",
    progress: 75,
    startDate: "2026-08-20",
    members: ["U-005"],
  },
]

const SEED_MEMBERS: Member[] = [
  {
    userId: "U-001",
    role: "Administrador",
    name: "María García",
    email: "maria.garcia@empresa.pe",
    position: "Frontend Developer",
    birthdate: "1996-04-12",
    phone: "987654321",
    projectId: "P-001",
    isActive: true,
  },
  {
    userId: "U-002",
    role: "Editor",
    name: "Juan Pérez",
    email: "juan.perez@empresa.pe",
    position: "Backend Developer",
    birthdate: "1994-09-03",
    phone: "987111222",
    projectId: "P-001",
    isActive: true,
  },
  {
    userId: "U-003",
    role: "Editor",
    name: "Ana López",
    email: "ana.lopez@empresa.pe",
    position: "UI/UX Designer",
    birthdate: "1998-01-27",
    phone: "987333444",
    projectId: "P-002",
    isActive: false,
  },
  {
    userId: "U-004",
    role: "Administrador",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@empresa.pe",
    position: "DevOps Engineer",
    birthdate: "1992-07-19",
    phone: "987555666",
    projectId: "P-004",
    isActive: true,
  },
  {
    userId: "U-005",
    role: "Lector",
    name: "Laura Martínez",
    email: "laura.martinez@empresa.pe",
    position: "Project Manager",
    birthdate: "1990-11-05",
    phone: "987777888",
    projectId: "P-003",
    isActive: true,
  },
]

const SEED_TASKS: Task[] = [
  {
    id: "T-001",
    description: "Implementar autenticación",
    projectId: "P-001",
    status: "En progreso",
    priority: "Alta",
    userId: "U-001",
    dateline: "2026-11-15",
  },
  {
    id: "T-002",
    description: "Diseñar pantalla de perfil",
    projectId: "P-002",
    status: "Pendiente",
    priority: "Media",
    userId: "U-003",
    dateline: "2026-11-20",
  },
  {
    id: "T-003",
    description: "Configurar CI/CD",
    projectId: "P-004",
    status: "Completado",
    priority: "Alta",
    userId: "U-004",
    dateline: "2026-11-10",
  },
  {
    id: "T-004",
    description: "Optimizar queries SQL",
    projectId: "P-001",
    status: "En progreso",
    priority: "Urgente",
    userId: "U-002",
    dateline: "2026-11-12",
  },
  {
    id: "T-005",
    description: "Documentar API endpoints",
    projectId: "P-004",
    status: "Pendiente",
    priority: "Baja",
    userId: "U-005",
    dateline: "2026-11-25",
  },
  {
    id: "T-006",
    description: "Migrar tokens de color del Design System",
    projectId: "P-005",
    status: "Completado",
    priority: "Media",
    userId: "U-003",
    dateline: "2026-10-28",
  },
  {
    id: "T-007",
    description: "Integrar pasarela de pagos",
    projectId: "P-001",
    status: "Pendiente",
    priority: "Urgente",
    userId: "U-002",
    dateline: "2026-12-02",
  },
  {
    id: "T-008",
    description: "Definir métricas del panel",
    projectId: "P-003",
    status: "En progreso",
    priority: "Media",
    userId: "U-005",
    dateline: "2026-11-30",
  },
  {
    id: "T-009",
    description: "Maquetar landing institucional",
    projectId: "P-006",
    status: "Completado",
    priority: "Baja",
    userId: "U-001",
    dateline: "2026-11-05",
  },
  {
    id: "T-010",
    description: "Pruebas de carga del gateway",
    projectId: "P-004",
    status: "Pendiente",
    priority: "Alta",
    userId: "U-004",
    dateline: "2026-12-10",
  },
  {
    id: "T-011",
    description: "Publicar build en la tienda",
    projectId: "P-002",
    status: "En progreso",
    priority: "Alta",
    userId: "U-003",
    dateline: "2026-12-15",
  },
  {
    id: "T-012",
    description: "Auditoría de accesibilidad",
    projectId: "P-005",
    status: "Completado",
    priority: "Media",
    userId: "U-001",
    dateline: "2026-10-20",
  },
]

const SEED_ACTIVITY: ActivityEntry[] = [
  {
    id: "A-001",
    user: "María García",
    action: "completó la tarea",
    target: "Maquetar landing institucional",
    label: "Hace 5 min",
  },
  {
    id: "A-002",
    user: "Juan Pérez",
    action: "comentó en",
    target: "Optimizar queries SQL",
    label: "Hace 1 hora",
  },
  {
    id: "A-003",
    user: "Ana López",
    action: "actualizó el proyecto",
    target: "Mobile App",
    label: "Hace 2 horas",
  },
  {
    id: "A-004",
    user: "Carlos Ruiz",
    action: "cerró la tarea",
    target: "Configurar CI/CD",
    label: "Hace 3 horas",
  },
]

const SEED_SETTINGS: Settings = {
  organization: "Tecsup — Laboratorio 11",
  notificationEmail: "notificaciones@empresa.pe",
  timezone: "America/Lima",
  language: "es",
  theme: "light",
  emailNotifications: true,
  weeklyReport: false,
  maintenanceMode: false,
  tasksPerPage: 5,
}

/* -------------------------------------------------------------------------- */
/*  Contexto                                                                   */
/* -------------------------------------------------------------------------- */

export interface Metrics {
  totalProjects: number
  completedProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  completionRate: number
  averageProgress: number
  totalMembers: number
  activeMembers: number
}

interface DashboardContextValue {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  activity: ActivityEntry[]
  settings: Settings
  metrics: Metrics

  createProject: (data: Omit<Project, "id">) => Project
  updateProject: (id: string, data: Omit<Project, "id">) => void
  deleteProject: (id: string) => void

  createMember: (data: Omit<Member, "userId">) => Member
  updateMember: (userId: string, data: Omit<Member, "userId">) => void
  deleteMember: (userId: string) => void

  createTask: (data: Omit<Task, "id">) => Task
  updateTask: (id: string, data: Omit<Task, "id">) => void
  deleteTask: (id: string) => void

  saveSettings: (data: Settings) => void

  projectName: (projectId: string) => string
  memberName: (userId: string) => string
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error("useDashboard debe usarse dentro de <DashboardProvider>")
  }
  return ctx
}

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS)
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [activity, setActivity] = useState<ActivityEntry[]>(SEED_ACTIVITY)
  const [settings, setSettings] = useState<Settings>(SEED_SETTINGS)

  // Contadores de id: solo se incrementan tras una interacción del usuario,
  // por lo que no afectan al HTML renderizado en el servidor.
  const counters = useRef({ project: 6, member: 5, task: 12, activity: 4 })

  const pushActivity = useCallback(
    (user: string, action: string, target: string) => {
      counters.current.activity += 1
      const entry: ActivityEntry = {
        id: `A-${String(counters.current.activity).padStart(3, "0")}`,
        user,
        action,
        target,
        at: Date.now(),
      }
      setActivity((prev) => [entry, ...prev].slice(0, 12))
    },
    []
  )

  /* ----------------------------- Proyectos ----------------------------- */

  const createProject = useCallback(
    (data: Omit<Project, "id">) => {
      counters.current.project += 1
      const project: Project = {
        ...data,
        id: `P-${String(counters.current.project).padStart(3, "0")}`,
      }
      setProjects((prev) => [...prev, project])
      pushActivity("Tú", "creó el proyecto", project.title)
      return project
    },
    [pushActivity]
  )

  const updateProject = useCallback(
    (id: string, data: Omit<Project, "id">) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...data, id } : p))
      )
      pushActivity("Tú", "actualizó el proyecto", data.title)
    },
    [pushActivity]
  )

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const target = prev.find((p) => p.id === id)
        if (target) pushActivity("Tú", "eliminó el proyecto", target.title)
        return prev.filter((p) => p.id !== id)
      })
      // Las tareas del proyecto eliminado se quitan: no pueden quedar huérfanas.
      setTasks((prev) => prev.filter((t) => t.projectId !== id))
      // Los miembros se conservan, pero pierden la asignación al proyecto.
      setMembers((prev) =>
        prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m))
      )
    },
    [pushActivity]
  )

  /* ------------------------------ Miembros ----------------------------- */

  const createMember = useCallback(
    (data: Omit<Member, "userId">) => {
      counters.current.member += 1
      const member: Member = {
        ...data,
        userId: `U-${String(counters.current.member).padStart(3, "0")}`,
      }
      setMembers((prev) => [...prev, member])
      if (member.projectId) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === member.projectId
              ? { ...p, members: [...p.members, member.userId] }
              : p
          )
        )
      }
      pushActivity("Tú", "registró al miembro", member.name)
      return member
    },
    [pushActivity]
  )

  const updateMember = useCallback(
    (userId: string, data: Omit<Member, "userId">) => {
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId ? { ...data, userId } : m))
      )
      setProjects((prev) =>
        prev.map((p) => {
          const shouldHave = p.id === data.projectId
          const has = p.members.includes(userId)
          if (shouldHave && !has) return { ...p, members: [...p.members, userId] }
          if (!shouldHave && has)
            return { ...p, members: p.members.filter((id) => id !== userId) }
          return p
        })
      )
      pushActivity("Tú", "actualizó al miembro", data.name)
    },
    [pushActivity]
  )

  const deleteMember = useCallback(
    (userId: string) => {
      setMembers((prev) => {
        const target = prev.find((m) => m.userId === userId)
        if (target) pushActivity("Tú", "eliminó al miembro", target.name)
        return prev.filter((m) => m.userId !== userId)
      })
      setProjects((prev) =>
        prev.map((p) => ({
          ...p,
          members: p.members.filter((id) => id !== userId),
        }))
      )
      // Las tareas asignadas quedan sin responsable en lugar de borrarse.
      setTasks((prev) =>
        prev.map((t) => (t.userId === userId ? { ...t, userId: "" } : t))
      )
    },
    [pushActivity]
  )

  /* ------------------------------- Tareas ------------------------------ */

  const createTask = useCallback(
    (data: Omit<Task, "id">) => {
      counters.current.task += 1
      const task: Task = {
        ...data,
        id: `T-${String(counters.current.task).padStart(3, "0")}`,
      }
      setTasks((prev) => [...prev, task])
      pushActivity("Tú", "creó la tarea", task.description)
      return task
    },
    [pushActivity]
  )

  const updateTask = useCallback(
    (id: string, data: Omit<Task, "id">) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...data, id } : t)))
      pushActivity("Tú", "actualizó la tarea", data.description)
    },
    [pushActivity]
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const target = prev.find((t) => t.id === id)
        if (target) pushActivity("Tú", "eliminó la tarea", target.description)
        return prev.filter((t) => t.id !== id)
      })
    },
    [pushActivity]
  )

  /* ---------------------------- Configuración --------------------------- */

  const saveSettings = useCallback(
    (data: Settings) => {
      setSettings(data)
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", data.theme === "dark")
      }
      pushActivity("Tú", "guardó la", "configuración de la cuenta")
    },
    [pushActivity]
  )

  /* ------------------------------ Métricas ------------------------------ */

  const metrics = useMemo<Metrics>(() => {
    const completedTasks = tasks.filter((t) => t.status === "Completado").length
    const averageProgress = projects.length
      ? Math.round(
          projects.reduce((acc, p) => acc + p.progress, 0) / projects.length
        )
      : 0
    return {
      totalProjects: projects.length,
      completedProjects: projects.filter((p) => p.status === "Completado")
        .length,
      activeProjects: projects.filter((p) => p.status === "En progreso").length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks: tasks.filter((t) => t.status === "Pendiente").length,
      completionRate: tasks.length
        ? Math.round((completedTasks / tasks.length) * 100)
        : 0,
      averageProgress,
      totalMembers: members.length,
      activeMembers: members.filter((m) => m.isActive).length,
    }
  }, [projects, tasks, members])

  const projectName = useCallback(
    (projectId: string) =>
      projects.find((p) => p.id === projectId)?.title ?? "Sin proyecto",
    [projects]
  )

  const memberName = useCallback(
    (userId: string) =>
      members.find((m) => m.userId === userId)?.name ?? "Sin asignar",
    [members]
  )

  const value = useMemo<DashboardContextValue>(
    () => ({
      projects,
      members,
      tasks,
      activity,
      settings,
      metrics,
      createProject,
      updateProject,
      deleteProject,
      createMember,
      updateMember,
      deleteMember,
      createTask,
      updateTask,
      deleteTask,
      saveSettings,
      projectName,
      memberName,
    }),
    [
      projects,
      members,
      tasks,
      activity,
      settings,
      metrics,
      createProject,
      updateProject,
      deleteProject,
      createMember,
      updateMember,
      deleteMember,
      createTask,
      updateTask,
      deleteTask,
      saveSettings,
      projectName,
      memberName,
    ]
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

/** Simula la latencia de una petición al backend. */
export function fakeRequest(ms = 900): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
