# TaskFlow — Agenda personal

Aplicación de gestión de tareas personales construida 100% en frontend: sin backend, sin base de datos externa — todo vive en el navegador (LocalStorage), pensada como una agenda de uso individual, no como una suite de gestión de equipos.

## Funcionalidades

- **Tablero Kanban por prioridad** (Alta / Media / Baja) con drag & drop entre columnas y reordenamiento, usando `dnd-kit`.
- **Vista "Hoy"**: tareas vencidas, que vencen hoy y las próximas 7 días, con métricas rápidas.
- **Calendario mensual** con tus tareas ubicadas por fecha límite, más los **festivos oficiales de Colombia** obtenidos en vivo de la API de [Nager.Date](https://date.nager.at).
- **Estadísticas**: racha de días completando tareas, resumen semanal y distribución de pendientes por prioridad (gráficas con Recharts).
- **Tema claro/oscuro**, con paleta derivada de un sistema de diseño Material 3 propio.
- **Recordatorio dentro de la app** (sin permisos del navegador) si hay tareas vencidas o por vencer.
- **Exportar/Importar tus datos como archivo JSON** — copia de seguridad simple, sin necesidad de cuenta ni backend.
- Accesibilidad cuidada: navegación por teclado, foco atrapado en modales, `aria-label`s, `prefers-reduced-motion` respetado.
- Manejo de errores con un `ErrorBoundary` global (nunca pantalla en blanco) y estados de carga con *skeletons*.

## Stack

| Categoría | Herramienta |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS v4 (tokens de diseño propios vía `@theme`) |
| Estado | Zustand (+ `persist` en LocalStorage) |
| Formularios | React Hook Form + Zod |
| Drag & Drop | dnd-kit |
| Fechas | date-fns |
| Gráficas | Recharts |
| Notificaciones (toast) | Sonner |
| Iconos | Lucide React |

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para build de producción:

```bash
npm run build
npm run preview
```

## Decisiones de diseño

Los datos completados se conservan 30 días (para que las estadísticas tengan historial), pero se ocultan del tablero al día siguiente de completarse para no acumular desorden visual; el conteo histórico sobrevive en un registro aparte aunque la tarea en sí se purgue.

## Licencia

MIT

## Autor

Camilo Vanegas