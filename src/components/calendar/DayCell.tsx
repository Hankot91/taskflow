import { format, isSameMonth, isToday, isSunday } from "date-fns";
import { es } from "date-fns/locale";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const priorityDot = {
	high: "bg-error",
	medium: "bg-secondary",
	low: "bg-tertiary",
} as const;

interface DayCellProps {
	day: Date;
	monthAnchor: Date;
	tasks: Task[];
	onTaskClick: (task: Task) => void;
	onAddClick: (day: Date) => void;
	holidays: Record<string, string>;
}
export function DayCell({
	day,
	monthAnchor,
	tasks,
	onTaskClick,
	onAddClick,
	holidays,
}: DayCellProps) {
	const inCurrentMonth = isSameMonth(day, monthAnchor);
	const today = isToday(day);
	const sunday = isSunday(day);
	const holidayName = holidays[format(day, "yyyy-MM-dd")];
	const isHoliday = Boolean(holidayName);

	const visibleTasks = tasks.slice(0, 4);
	const overflowCount = tasks.length - visibleTasks.length;

	return (
		<div
			title={holidayName}
			className={cn(
				"group flex min-h-37.5 flex-col gap-1.5 rounded-xl p-sm transition-colors",
				inCurrentMonth
					? "bg-surface-container-lowest/60"
					: "bg-transparent opacity-40",
				(sunday || isHoliday) &&
					inCurrentMonth &&
					"bg-error-container/10",
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<span
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-full text-body-md font-bold",
							today
								? "bg-primary text-on-primary"
								: sunday || isHoliday
									? "text-error"
									: "text-on-surface-variant",
						)}
					>
						{format(day, "d", { locale: es })}
					</span>
					{isHoliday && inCurrentMonth && (
						<span
							className="hidden h-1.5 w-1.5 rounded-full bg-error sm:block"
							aria-hidden="true"
						/>
					)}
				</div>
				<button
					type="button"
					onClick={() => onAddClick(day)}
					className="rounded p-1 text-on-surface-variant opacity-40 transition-opacity hover:text-primary focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
					aria-label={`Agregar tarea el ${format(day, "d MMMM", { locale: es })}`}
				>
					<Plus className="h-4 w-4" aria-hidden="true" />
				</button>
			</div>

			{isHoliday && inCurrentMonth && (
				<span className="truncate text-[11px] font-semibold text-error">
					{holidayName}
				</span>
			)}

			<div className="flex flex-1 flex-col gap-1">
				{visibleTasks.map((task) => (
					<button
						key={task.id}
						type="button"
						onClick={() => onTaskClick(task)}
						className={cn(
							"flex items-center gap-1.5 truncate rounded-md px-2 py-1 text-left text-[12px] font-medium text-on-surface hover:bg-surface-container-high",
							task.completed &&
								"text-on-surface-variant/50 line-through",
						)}
					>
						<span
							className={cn(
								"h-2 w-2 shrink-0 rounded-full",
								priorityDot[task.priority],
							)}
						/>
						<span className="truncate">{task.title}</span>
					</button>
				))}
				{overflowCount > 0 && (
					<span className="px-2 text-[11px] font-medium text-on-surface-variant/60">
						+{overflowCount} más
					</span>
				)}
			</div>
		</div>
	);
}
