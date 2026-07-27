import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUp, Equal, ArrowDown, Check, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";
import type { Task } from "@/types";

const priorityConfig = {
	high: { icon: ArrowUp, text: "text-error" },
	medium: { icon: Equal, text: "text-secondary" },
	low: { icon: ArrowDown, text: "text-tertiary" },
} as const;

interface TaskListItemProps {
	task: Task;
	onClick: () => void;
	dateTone?: "danger" | "default";
}

export function TaskListItem({
	task,
	onClick,
	dateTone = "default",
}: TaskListItemProps) {
	const toggleCompleted = useTaskStore((s) => s.toggleCompleted);
	const priority = priorityConfig[task.priority];

	return (
		<div className="flex items-center gap-md rounded-xl bg-surface-container-lowest/70 p-md shadow-sm ring-1 ring-black/5 backdrop-blur-md">
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					toggleCompleted(task.id);
				}}
				aria-pressed={task.completed}
				aria-label={
					task.completed
						? "Marcar como pendiente"
						: "Marcar como completada"
				}
				className={cn(
					"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
					task.completed
						? "border-secondary bg-secondary text-on-secondary"
						: "border-outline-variant text-transparent hover:border-primary",
				)}
			>
				<Check className="h-3 w-3" aria-hidden="true" />
			</button>

			<button
				type="button"
				onClick={onClick}
				className="flex min-w-0 flex-1 items-center gap-sm text-left"
			>
				<priority.icon
					className={cn("h-3.5 w-3.5 shrink-0", priority.text)}
					aria-hidden="true"
				/>
				<span
					className={cn(
						"truncate text-body-md text-on-surface",
						task.completed &&
							"text-on-surface-variant/50 line-through",
					)}
				>
					{task.title}
				</span>
			</button>

			{task.dueDate && (
				<span
					className={cn(
						"flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[11px] font-medium",
						dateTone === "danger"
							? "bg-error-container/40 text-error"
							: "bg-surface-container-low text-on-surface-variant",
					)}
				>
					<CalendarClock className="h-3 w-3" aria-hidden="true" />
					{format(new Date(task.dueDate), "d MMM", { locale: es })}
				</span>
			)}
		</div>
	);
}
