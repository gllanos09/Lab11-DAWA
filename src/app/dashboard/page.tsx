"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import { OverviewTab } from "@/components/dashboard/OverviewTab"
import { ProjectsTab } from "@/components/dashboard/ProjectsTab"
import { SettingsTab } from "@/components/dashboard/SettingsTab"
import { TeamTab } from "@/components/dashboard/TeamTab"
import { DashboardProvider } from "@/components/dashboard/store"

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/40 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-primary underline underline-offset-4"
            >
              &larr; Volver al inicio
            </Link>
            <h1 className="mt-3 mb-2 text-4xl font-bold">
              Dashboard de Proyectos
            </h1>
            <p className="text-muted-foreground">
              Gestiona tus proyectos y tareas con shadcn/ui
            </p>
            <div className="pt-4">
              <ProjectForm />
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <ProjectsTab />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Tareas</CardTitle>
                  <CardDescription>
                    Administra todas las tareas de tus proyectos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TasksTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <TeamTab />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardProvider>
  )
}
