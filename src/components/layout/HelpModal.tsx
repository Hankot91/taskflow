import {
	X,
	LayoutGrid,
	Home,
	KanbanSquare,
	CalendarDays,
	BarChart3,
    Settings,
} from "lucide-react";
import { useModalA11y } from "@/hooks/useModalA11y";

const guide = [
	{
		icon: Home,
		title: "Hoy",
		text: "Resumen del día: qué está vencido, qué vence hoy y qué se acerca en los próximos 7 días.",
	},
	{
		icon: KanbanSquare,
		title: "Tablero",
		text: "Tus tareas organizadas por prioridad. Arrástralas entre columnas o dentro de la misma para reordenar.",
	},
	{
		icon: CalendarDays,
		title: "Calendario",
		text: "Vista de mes con tus tareas ubicadas en su fecha límite, más los festivos oficiales de Colombia.",
	},
	{
		icon: BarChart3,
		title: "Estadísticas",
		text: "Tu racha de días completando tareas, y cuánto has avanzado en las últimas semanas.",
	},
	{
		icon: Settings,
		title: "Copia de seguridad de tus tareas",
		text: 'Todas tus tareas se guardan solo en este navegador — si cambias de computador o borras el historial, se pierden. En Configuración puedes hacer clic en "Exportar" para descargar un archivo con todas tus tareas (funciona como una copia de seguridad, similar a hacer una foto de todo lo que tienes ahora). Guarda ese archivo donde quieras (correo, USB, la nube). Si más adelante quieres recuperarlas, ve a Configuración → "Importar" y selecciona ese mismo archivo — no necesitas saber nada técnico, solo elegirlo como si adjuntaras una foto.',
	},
];

interface HelpModalProps {
	open: boolean;
	onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
	const containerRef = useModalA11y<HTMLDivElement>(open, onClose);

	if (!open) return null;

	return (
		<>
			<button
				type="button"
				aria-hidden="true"
				tabIndex={-1}
				onClick={onClose}
				className="fixed inset-0 z-50 bg-on-background/40"
			/>
			<div
				ref={containerRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby="help-modal-title"
				className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-104 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-container-lowest/95 p-lg shadow-2xl ring-1 ring-black/5 backdrop-blur-xl focus:outline-none"
			>
				<div className="mb-lg flex items-center justify-between">
					<div className="flex items-center gap-sm">
						<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
							<LayoutGrid
								className="h-4.5 w-4.5"
								aria-hidden="true"
							/>
						</span>
						<h2
							id="help-modal-title"
							className="text-headline-md font-bold text-on-surface"
						>
							Cómo usar TaskFlow
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
						aria-label="Cerrar tutorial"
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<div className="space-y-md">
					{guide.map((item) => (
						<div
							key={item.title}
							className="flex items-start gap-sm"
						>
							<item.icon
								className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary"
								aria-hidden="true"
							/>
							<div>
								<p className="text-body-md font-bold text-on-surface">
									{item.title}
								</p>
								<p className="text-[13px] text-on-surface-variant">
									{item.text}
								</p>
							</div>
						</div>
					))}
				</div>

				<button
					type="button"
					onClick={onClose}
					className="mt-lg w-full rounded-lg bg-primary py-2 text-label-sm font-medium text-on-primary hover:bg-primary-container"
				>
					Entendido
				</button>
			</div>
		</>
	);
}
