"use client"

import { useState } from "react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MemberForm } from "@/components/dashboard/MemberForm"
import { useDashboard } from "@/components/dashboard/store"
import { formatDate, initials, type Member } from "@/lib/dashboard-types"

export function TeamTab() {
  const { members, projectName, deleteMember } = useDashboard()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [toDelete, setToDelete] = useState<Member | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Miembros del Equipo</CardTitle>
              <CardDescription>
                Gestiona los miembros de tu equipo y sus roles
              </CardDescription>
            </div>
            <Button onClick={() => setCreating(true)}>
              <PlusIcon data-icon="inline-start" />
              Nuevo Miembro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{initials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({member.userId})
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.position} · {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email} · {member.phone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Nac. {formatDate(member.birthdate)} ·{" "}
                      {projectName(member.projectId)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(member)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setToDelete(member)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No hay miembros registrados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <MemberForm open={creating} onOpenChange={setCreating} />

      {editing && (
        <MemberForm
          member={editing}
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
            <AlertDialogTitle>¿Eliminar a este miembro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará «{toDelete?.name}» del equipo. Sus tareas no se
              borran: quedarán sin responsable asignado. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteMember(toDelete.userId)
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
