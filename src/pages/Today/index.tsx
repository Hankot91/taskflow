import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	AlertTriangle,
	CalendarClock,
	CheckCircle2,
	ListTodo,
} from "lucide-react";
import {
	isBefore,
	isToday,
	isWithinInterval,
	startOfDay,
	addDays,
	format,
} from "date-fns";
import { es } from "date-fns/locale";
import { TaskListItem } from "@/components/today/TaskListItem";
import { TaskPanel } from "@/components/board/TaskPanel";
import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import { TodaySkeleton } from "@/components/today/TodaySkeleton";
import { taskMatchesQuery } from "@/lib/utils";
import type { Task } from "@/types";

export default function TodayPage() {
	const tasks = useTaskStore((s) => s.tasks);
	const hasHydrated = useTaskStore((s) => s.hasHydrated);
	const searchQuery = useUIStore((s) => s.searchQuery);
	const notificationsEnabled = useUIStore((s) => s.notificationsEnabled);
	const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
	const [panelOpen, setPanelOpen] = useState(false);

	const today = startOfDay(new Date());

	const { overdue, dueToday, upcoming, completedCount, pendingCount } =
		useMemo(() => {
			const pending = tasks.filter((t) => !t.completed);
			const visible = pending.filter((t) =>
				taskMatchesQuery(t, searchQuery),
			);

			const overdue = visible.filter(
				(t) => t.dueDate && isBefore(new Date(t.dueDate), today),
			);
			const dueToday = visible.filter(
				(t) => t.dueDate && isToday(new Date(t.dueDate)),
			);
			const upcoming = visible.filter(
				(t) =>
					t.dueDate &&
					isWithinInterval(new Date(t.dueDate), {
						start: addDays(today, 1),
						end: addDays(today, 7),
					}),
			);

			return {
				overdue,
				dueToday,
				upcoming,
				// Los contadores reflejan el total real, no lo filtrado por
				// búsqueda — son la verdad del estado, no del filtro visible.
				completedCount: tasks.filter((t) => t.completed).length,
				pendingCount: pending.length,
			};
		}, [tasks, today, searchQuery]);

	useEffect(() => {
		if (!notificationsEnabled) return;
		const todayKey = format(new Date(), "yyyy-MM-dd");
		const lastNotified = localStorage.getItem("taskflow-last-notified");
		if (lastNotified === todayKey) return;
		if (overdue.length === 0 && dueToday.length === 0) return;

		const parts: string[] = [];
		if (overdue.length > 0) parts.push(`${overdue.length} vencida(s)`);
		if (dueToday.length > 0) parts.push(`${dueToday.length} para hoy`);

		toast.warning("Tienes tareas pendientes", {
			description: parts.join(" · "),
		});
		localStorage.setItem("taskflow-last-notified", todayKey);
	}, [notificationsEnabled, overdue.length, dueToday.length]);

	const openEdit = (task: Task) => {
		setEditingTask(task);
		setPanelOpen(true);
	};

	const stats = [
		{
			label: "Vencidas",
			value: overdue.length,
			icon: AlertTriangle,
			tone: "text-error",
		},
		{
			label: "Vencen hoy",
			value: dueToday.length,
			icon: CalendarClock,
			tone: "text-primary",
		},
		{
			label: "Pendientes",
			value: pendingCount,
			icon: ListTodo,
			tone: "text-on-surface-variant",
		},
		{
			label: "Completadas",
			value: completedCount,
			icon: CheckCircle2,
			tone: "text-secondary",
		},
	];

	if (!hasHydrated) return <TodaySkeleton />;
	return (
		<>
			<div className="mb-xl">
				<h1
					className="text-headline-md font-bold text-on-surface"
					style={{ fontFamily: "var(--font-display)" }}
				>
					Hola, Camilo
				</h1>
				<p className="mt-1 text-body-md text-on-surface-variant">
					{format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
				</p>
			</div>

			<div className="mb-2xl grid grid-cols-2 gap-md sm:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md"
					>
						<stat.icon
							className={`h-5 w-5 ${stat.tone}`}
							aria-hidden="true"
						/>
						<p className="mt-sm text-display-lg-mobile font-bold text-on-surface">
							{stat.value}
						</p>
						<p className="text-label-sm text-on-surface-variant">
							{stat.label}
						</p>
					</div>
				))}
			</div>

			<div className="space-y-2xl">
				{overdue.length > 0 && (
					<section>
						<h2 className="mb-md flex items-center gap-sm text-body-lg font-bold text-error">
							<AlertTriangle
								className="h-4 w-4"
								aria-hidden="true"
							/>
							Vencidas
						</h2>
						<div className="space-y-sm">
							{overdue.map((task) => (
								<TaskListItem
									key={task.id}
									task={task}
									onClick={() => openEdit(task)}
									dateTone="danger"
								/>
							))}
						</div>
					</section>
				)}

				<section>
					<h2 className="mb-md text-body-lg font-bold text-on-surface">
						Para hoy
					</h2>
					{dueToday.length === 0 ? (
						<p className="rounded-xl border border-dashed border-outline-variant/40 p-lg text-center text-xs text-on-surface-variant/60">
							{searchQuery.trim()
								? "Ninguna coincide con la búsqueda"
								: "Nada vence hoy 🎉"}
						</p>
					) : (
						<div className="space-y-sm">
							{dueToday.map((task) => (
								<TaskListItem
									key={task.id}
									task={task}
									onClick={() => openEdit(task)}
								/>
							))}
						</div>
					)}
				</section>

				<section>
					<h2 className="mb-md text-body-lg font-bold text-on-surface">
						Próximos 7 días
					</h2>
					{upcoming.length === 0 ? (
						<p className="rounded-xl border border-dashed border-outline-variant/40 p-lg text-center text-xs text-on-surface-variant/60">
							{searchQuery.trim()
								? "Ninguna coincide con la búsqueda"
								: "Nada en el horizonte cercano"}
						</p>
					) : (
						<div className="space-y-sm">
							{upcoming.map((task) => (
								<TaskListItem
									key={task.id}
									task={task}
									onClick={() => openEdit(task)}
								/>
							))}
						</div>
					)}
				</section>
			</div>

			<TaskPanel
				key={panelOpen ? (editingTask?.id ?? "new") : "closed"}
				open={panelOpen}
				onClose={() => setPanelOpen(false)}
				task={editingTask}
			/>
		</>
	);
}
