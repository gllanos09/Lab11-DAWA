import type { NextConfig } from "next";

// Tailwind CSS v4 se procesa con el plugin de PostCSS (postcss.config.mjs).
// No se usa el loader de Turbopack para CSS porque tambien se aplica a los
// archivos *.module.css y, al hacerlo, Turbopack deja de exportar el mapa de
// clases: `styles.button` llegaba como undefined dentro de los componentes del
// Ejercicio 1.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Evita que `next dev` genere y reescriba el archivo AGENTS.md.
  agentRules: false,
};

export default nextConfig;
