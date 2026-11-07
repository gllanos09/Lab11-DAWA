import Link from "next/link";

const links = [
  {
    href: "/styling",
    label: "Ejercicio 1 — Componentes reutilizables",
    detail: "CSS Modules + Tailwind CSS: Button, Card, Badge e Input.",
  },
  {
    href: "/dashboard",
    label: "Ejercicio 2 y Tarea — Dashboard de Proyectos",
    detail:
      "shadcn/ui con CRUD de proyectos, equipo y tareas, calendario, paginación y validaciones.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Laboratorio 11
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Desarrollo de Aplicaciones Web Avanzado
        </h1>
        <p className="text-muted-foreground">
          Componentes y estilización: CSS Modules, Tailwind CSS y shadcn/ui.
        </p>
      </header>

      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <span className="block text-lg font-semibold">{link.label}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {link.detail}
            </span>
            <span className="mt-3 inline-block text-sm font-medium text-primary">
              Abrir {link.href} &rarr;
            </span>
          </Link>
        ))}
      </nav>

      <footer className="text-sm text-muted-foreground">
        Arévalo Sermeño, Edwin William — 5 - C24 - Sección A-B
      </footer>
    </main>
  );
}
