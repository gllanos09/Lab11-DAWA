"use client"

import { useEffect, useState } from "react"
import {
  ActivityIcon,
  CheckCircle2Icon,
  FolderKanbanIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useDashboard } from "@/components/dashboard/store"
import { initials, relativeTime } from "@/lib/dashboard-types"

export function OverviewTab() {
  const { metrics, activity, settings } = useDashboard()

  // Spinner inicial: simula la carga de las métricas desde el backend.
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(id)
  }, [])

  // Reloj para las etiquetas "Hace X min". Se actualiza solo desde el
  // callback del intervalo, de modo que el render sigue siendo puro.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const cards = [
    {
      title: "Total Proyectos",
      value: metrics.totalProjects,
      hint: `${metrics.activeProjects} en progreso · ${metrics.completedProjects} completados`,
      Icon: FolderKanbanIcon,
    },
    {
      title: "Tareas Completadas",
      value: metrics.completedTasks,
      hint: `${metrics.completionRate}% de ${metrics.totalTasks} tareas · ${metrics.pendingTasks} pendientes`,
      Icon: CheckCircle2Icon,
    },
    {
      title: "Progreso Promedio",
      value: `${metrics.averageProgress}%`,
      hint: "Promedio del avance de todos los proyectos",
      Icon: TrendingUpIcon,
    },
    {
      title: "Miembros Activos",
      value: metrics.activeMembers,
      hint: `de ${metrics.totalMembers} miembros registrados`,
      Icon: UsersIcon,
    },
  ]

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
          <Spinner className="size-7 text-primary" />
          <p className="text-sm text-muted-foreground">
            Cargando métricas del Dashboard...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, hint, Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-primary" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>
            Se registra cada alta, edición o baja hecha en el Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{initials(entry.user)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm leading-none font-medium">
                    {entry.user}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.action}{" "}
                    <span className="font-medium">{entry.target}</span>
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.label ??
                    (now && entry.at
                      ? relativeTime(entry.at, now)
                      : "Hace unos segundos")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración vigente</CardTitle>
          <CardDescription>
            Valores aplicados desde la pestaña Configuración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Organización</dt>
              <dd className="font-medium">{settings.organization}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Zona horaria</dt>
              <dd className="font-medium">{settings.timezone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tareas por página</dt>
              <dd className="font-medium">{settings.tasksPerPage}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Notificaciones</dt>
              <dd className="font-medium">
                {settings.emailNotifications ? "Activadas" : "Desactivadas"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
