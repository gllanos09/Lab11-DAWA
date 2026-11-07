# Lab11-DAWA — Componentes y Estilización

Laboratorio 11 del curso **Desarrollo de Aplicaciones Web Avanzado** (5 - C24, Sección A-B).

**Alumno:** Arévalo Sermeño, Edwin William

Aplicación Next.js que reúne los dos ejercicios del laboratorio y la tarea en un
solo proyecto desplegable:

| Ruta | Contenido |
|---|---|
| `/` | Índice con enlaces a las dos rutas. |
| `/styling` | **Ejercicio 1** — componentes reutilizables con CSS Modules + Tailwind CSS. |
| `/dashboard` | **Ejercicio 2 + Tarea** — Dashboard de Proyectos con shadcn/ui y CRUD completo. |

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4 (vía `@tailwindcss/postcss`)
- CSS Modules
- shadcn/ui (base Radix UI, preset Nova)

## Ejecutar en local

```bash
npm install
npm run dev
```

La aplicación queda en <http://localhost:3000>.

## Ejercicio 1 — CSS Modules + Tailwind (`/styling`)

| Componente | Ubicación | Técnica |
|---|---|---|
| `Button` | `src/components/custom/Button.tsx` + `.module.css` | CSS Modules para onda al click, spinner y gradientes; Tailwind para tamaños. |
| `Card` | `src/components/cards/Card.tsx` | Solo Tailwind. |
| `Badge` | `src/components/custom/Badge.tsx` | Solo Tailwind. |
| `Input` | `src/components/custom/Input.tsx` + `.module.css` | CSS Modules para label flotante, shake de error y focus; Tailwind para estructura. |

> Los componentes del Ejercicio 1 viven en `src/components/custom/` en lugar de
> `src/components/ui/`: Windows no distingue mayúsculas en los nombres de
> archivo, y `Button.tsx` chocaría con el `button.tsx` que instala shadcn/ui en
> esa misma carpeta.

## Ejercicio 2 + Tarea — shadcn/ui (`/dashboard`)

Componentes de shadcn/ui instalados: `button`, `card`, `input`, `label`,
`dialog`, `tabs`, `select`, `badge`, `avatar`, `switch`, `table`, `checkbox`,
`spinner`, `alert`, `calendar`, `pagination`, `popover`, `textarea`,
`separator`, `alert-dialog`, `sonner`.

### Lo que resuelve la Tarea

- **Tema del proyecto cambiado** — shadcn se inicializó con el color base
  `neutral` y los tokens se reescribieron a una paleta violeta en
  `src/app/globals.css`.
- **Spinner** — en el envío de los tres formularios y en la carga inicial de las
  métricas, sobre una petición simulada (`fakeRequest`).
- **Alert** — validación de los formularios de proyecto, miembro y
  configuración, y confirmación de guardado.
- **Calendar** — fecha de inicio del proyecto, fecha de nacimiento del miembro
  (con selector de año) y fecha límite de la tarea.
- **Pagination** — listado de tareas, con el tamaño de página configurable
  desde la pestaña Configuración.

| Menú | Funcionalidad |
|---|---|
| Resumen | Métricas calculadas desde los datos en memoria y bitácora de actividad. |
| Proyectos | Alta, edición, detalle y eliminación; campo de miembros del equipo. |
| Equipo | CRUD de `[userId, role, name, email, position, birthdate, phone, projectId, isActive]`. |
| Tareas | CRUD de `[description, projectId, status, priority, userId, dateline]`, filtro por estado y paginación. |
| Configuración | Formulario de preferencias que afecta al resto del Dashboard. |

El estado vive en memoria (`src/components/dashboard/store.tsx`), tal como pide
el enunciado: no hay backend ni persistencia.

## Capturas

En `docs/capturas/`.
