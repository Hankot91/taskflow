import { useRef, useState } from "react";
import { Sun, Moon, Bell, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/store/useUIStore";
import { useTaskStore } from "@/store/useTaskStore";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { importFileSchema } from "@/lib/importSchema";
import { cn } from "@/lib/utils";

function ToggleRow({
	icon: Icon,
	title,
	description,
	checked,
	onChange,
}: {
	icon: typeof Sun;
	title: string;
	description: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center gap-md rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md">
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
				<Icon className="h-5 w-5" aria-hidden="true" />
			</span>
			<div className="min-w-0 flex-1">
				<p className="text-body-md font-bold text-on-surface">
					{title}
				</p>
				<p className="text-[13px] text-on-surface-variant">
					{description}
				</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={cn(
					"relative h-6 w-11 shrink-0 rounded-full transition-colors",
					checked ? "bg-secondary" : "bg-surface-container-high",
				)}
			>
				<span
					className={cn(
						"absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
						checked ? "translate-x-5" : "translate-x-0",
					)}
				/>
			</button>
		</div>
	);
}

export default function PreferencesPage() {
	const theme = useUIStore((s) => s.theme);
	const setTheme = useUIStore((s) => s.setTheme);
	const notificationsEnabled = useUIStore((s) => s.notificationsEnabled);
	const setNotificationsEnabled = useUIStore(
		(s) => s.setNotificationsEnabled,
	);

	const tasks = useTaskStore((s) => s.tasks);
	const completionCounts = useTaskStore((s) => s.completionCounts);
	const replaceAll = useTaskStore((s) => s.replaceAll);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pendingImport, setPendingImport] = useState<{
		tasks: typeof tasks;
		completionCounts: typeof completionCounts;
	} | null>(null);

	const handleExport = () => {
		const payload = JSON.stringify({ tasks, completionCounts }, null, 2);
		const blob = new Blob([payload], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Copia de seguridad descargada");
	};

	const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = ""; // permite volver a elegir el mismo archivo si se cancela
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const raw = JSON.parse(reader.result as string);
				const parsed = importFileSchema.safeParse(raw);

				if (!parsed.success) {
					toast.error("El archivo no tiene el formato esperado", {
						description:
							"Asegúrate de importar un archivo exportado desde TaskFlow.",
					});
					return;
				}

				setPendingImport(parsed.data);
			} catch {
				toast.error("No se pudo leer el archivo", {
					description: "Verifica que sea un archivo .json válido.",
				});
			}
		};
		reader.onerror = () => {
			toast.error("No se pudo leer el archivo");
		};
		reader.readAsText(file);
	};

	const confirmImport = () => {
		if (pendingImport) {
			replaceAll(pendingImport);
			toast.success("Datos importados correctamente");
		}
		setPendingImport(null);
	};

	return (
		<>
			<div className="mb-xl">
				<h1
					className="text-headline-md font-bold text-on-surface"
					style={{ fontFamily: "var(--font-display)" }}
				>
					Configuración
				</h1>
				<p className="mt-1 text-body-md text-on-surface-variant">
					Ajusta TaskFlow a tu gusto.
				</p>
			</div>

			<div className="max-w-112 space-y-md">
				<ToggleRow
					icon={theme === "dark" ? Moon : Sun}
					title="Tema oscuro"
					description="Cambia la apariencia de toda la app."
					checked={theme === "dark"}
					onChange={(checked) => setTheme(checked ? "dark" : "light")}
				/>

				<ToggleRow
					icon={Bell}
					title="Recordatorio al abrir la app"
					description="Avisa si hay tareas vencidas o que vencen hoy."
					checked={notificationsEnabled}
					onChange={setNotificationsEnabled}
				/>

				<div className="rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md">
					<p className="mb-1 text-body-md font-bold text-on-surface">
						Tus datos
					</p>
					<p className="mb-md text-[13px] text-on-surface-variant">
						Tus tareas solo existen en este navegador — si lo
						cambias o borras el historial, se pierden.{" "}
						<strong>Exportar</strong> descarga un archivo con todo
						lo que tienes ahora (guárdalo donde quieras, como una
						copia de seguridad). <strong>Importar</strong> lee ese
						mismo archivo para recuperarlas después, en este u otro
						computador.
					</p>

					<div className="flex flex-wrap gap-sm">
						<button
							type="button"
							onClick={handleExport}
							className="flex items-center gap-sm rounded-lg bg-primary px-4 py-2 text-label-sm font-medium text-on-primary hover:bg-primary-container"
						>
							<Download className="h-4 w-4" aria-hidden="true" />
							Exportar como JSON
						</button>

						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex items-center gap-sm rounded-lg border border-outline-variant px-4 py-2 text-label-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
						>
							<Upload className="h-4 w-4" aria-hidden="true" />
							Importar JSON
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="application/json"
							onChange={handleFileSelected}
							className="hidden"
							aria-label="Seleccionar archivo JSON para importar"
						/>
					</div>
				</div>
			</div>

			<ConfirmModal
				open={pendingImport !== null}
				title="¿Reemplazar tus tareas actuales?"
				description={`Se importarán ${pendingImport?.tasks.length ?? 0} tarea(s). Esto reemplaza todo lo que tienes ahora — no se puede deshacer.`}
				confirmLabel="Reemplazar"
				onConfirm={confirmImport}
				onCancel={() => setPendingImport(null)}
			/>
		</>
	);
}
