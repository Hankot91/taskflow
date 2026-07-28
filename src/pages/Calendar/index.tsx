import { useMemo, useState } from "react";
import {
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	format,
	isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DayCell } from "@/components/calendar/DayCell";
import { TaskListItem } from "@/components/today/TaskListItem";
import { TaskPanel } from "@/components/board/TaskPanel";
import { useTaskStore } from "@/store/useTaskStore";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";
import { cn } from "@/lib/utils";
import { useHolidays } from "@/hooks/useHolidays";
import type { Task, TaskPriority } from "@/types";

const weekdayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarPage() {
	const tasks = useTaskStore((s) => s.tasks);
	const hasHydrated = useTaskStore((s) => s.hasHydrated);
	const [anchorDate, setAnchorDate] = useState(new Date());
	const [selectedDay, setSelectedDay] = useState(new Date());
	const holidays = useHolidays(anchorDate.getFullYear());
	const [panelOpen, setPanelOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
	const [defaultDueDate, setDefaultDueDate] = useState<string | undefined>(
		undefined,
	);
	const [defaultPriority] = useState<TaskPriority | undefined>(undefined);

	const days = useMemo(() => {
		const start = startOfWeek(startOfMonth(anchorDate), {
			locale: es,
			weekStartsOn: 1,
		});
		const end = endOfWeek(endOfMonth(anchorDate), {
			locale: es,
			weekStartsOn: 1,
		});
		return eachDayOfInterval({ start, end });
	}, [anchorDate]);

	const openEdit = (task: Task) => {
		setEditingTask(task);
		setDefaultDueDate(undefined);
		setPanelOpen(true);
	};

	const openCreateOnDay = (day: Date) => {
		setEditingTask(undefined);
		setDefaultDueDate(format(day, "yyyy-MM-dd"));
		setPanelOpen(true);
	};

	if (!hasHydrated) return <CalendarSkeleton />;
	return (
		<>
			<div className="mb-lg flex items-center justify-between">
				<h1
					className="text-headline-md font-bold capitalize text-on-surface"
					style={{ fontFamily: "var(--font-display)" }}
				>
					{format(anchorDate, "MMMM yyyy", { locale: es })}
				</h1>
				<div className="flex items-center gap-sm">
					<button
						type="button"
						onClick={() => setAnchorDate(new Date())}
						className="rounded-lg bg-surface-container-high px-3 py-1.5 text-label-sm font-medium text-on-surface-variant hover:text-primary"
					>
						Hoy
					</button>
					<button
						type="button"
						onClick={() => setAnchorDate((d) => subMonths(d, 1))}
						className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
						aria-label="Mes anterior"
					>
						<ChevronLeft className="h-4 w-4" aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => setAnchorDate((d) => addMonths(d, 1))}
						className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
						aria-label="Mes siguiente"
					>
						<ChevronRight className="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			<div className="mb-sm grid grid-cols-7 gap-2">
				{weekdayLabels.map((label, i) => (
					<div
						key={label}
						className={cn(
							"px-xs text-center text-[12px] font-bold uppercase tracking-wide",
							i === 6
								? "text-error"
								: "text-on-surface-variant/60",
						)}
					>
						{label}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1.5 sm:gap-2">
				{days.map((day) => (
					<DayCell
						key={day.toISOString()}
						day={day}
						monthAnchor={anchorDate}
						tasks={tasks.filter(
							(t) =>
								t.dueDate &&
								isSameDay(new Date(t.dueDate), day),
						)}
						isSelected={isSameDay(day, selectedDay)}
						onSelect={setSelectedDay}
						onTaskClick={openEdit}
						onAddClick={openCreateOnDay}
						holidays={holidays}
					/>
				))}
			</div>


			<div className="mt-lg rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md sm:hidden">
				<div className="mb-md flex items-center justify-between gap-sm">
					<h2 className="text-body-lg font-bold capitalize text-on-surface">
						{format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
					</h2>
					<button
						type="button"
						onClick={() => openCreateOnDay(selectedDay)}
						className="flex shrink-0 items-center gap-1 rounded-lg bg-primary-container/20 px-3 py-1.5 text-label-sm font-bold text-primary hover:bg-primary-container/30"
						aria-label={`Agregar tarea el ${format(selectedDay, "d MMMM", { locale: es })}`}
					>
						<Plus className="h-3.5 w-3.5" aria-hidden="true" />
						Agregar
					</button>
				</div>

				{(() => {
					const holidayName =
						holidays[format(selectedDay, "yyyy-MM-dd")];
					return holidayName ? (
						<p className="mb-md rounded-lg bg-error-container/20 px-3 py-2 text-[13px] font-semibold text-error">
							{holidayName}
						</p>
					) : null;
				})()}

				{(() => {
					const dayTasks = tasks.filter(
						(t) =>
							t.dueDate &&
							isSameDay(new Date(t.dueDate), selectedDay),
					);
					return dayTasks.length === 0 ? (
						<p className="rounded-lg border border-dashed border-outline-variant/40 p-md text-center text-xs text-on-surface-variant/60">
							Sin tareas este día
						</p>
					) : (
						<div className="space-y-sm">
							{dayTasks.map((task) => (
								<TaskListItem
									key={task.id}
									task={task}
									onClick={() => openEdit(task)}
								/>
							))}
						</div>
					);
				})()}
			</div>

			<TaskPanel
				key={
					panelOpen
						? (editingTask?.id ?? defaultDueDate ?? "new")
						: "closed"
				}
				open={panelOpen}
				onClose={() => setPanelOpen(false)}
				task={editingTask}
				defaultPriority={defaultPriority}
				defaultDueDate={defaultDueDate}
			/>
		</>
	);
}
