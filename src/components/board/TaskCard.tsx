import { useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUp, Equal, ArrowDown, Check, CalendarClock } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";
import type { Task } from "@/types";

const priorityConfig = {
	high: {
		label: "Alta",
		icon: ArrowUp,
		bg: "bg-error-container/40",
		text: "text-error",
	},
	medium: {
		label: "Media",
		icon: Equal,
		bg: "bg-secondary-container/40",
		text: "text-secondary",
	},
	low: {
		label: "Baja",
		icon: ArrowDown,
		bg: "bg-tertiary-container/40",
		text: "text-tertiary",
	},
} as const;

const DRAG_CLICK_THRESHOLD_PX = 5;

interface TaskCardProps {
	task: Task;
	onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
	const toggleCompleted = useTaskStore((s) => s.toggleCompleted);
	const pointerDownAt = useRef<{ x: number; y: number } | null>(null);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		pointerDownAt.current = { x: e.clientX, y: e.clientY };
		listeners?.onPointerDown?.(e);
	};

	const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const start = pointerDownAt.current;
		pointerDownAt.current = null;

		if (start) {
			const movedX = Math.abs(e.clientX - start.x);
			const movedY = Math.abs(e.clientY - start.y);
			if (
				movedX > DRAG_CLICK_THRESHOLD_PX ||
				movedY > DRAG_CLICK_THRESHOLD_PX
			) {
				return; // fue un arrastre, no abrir el detalle
			}
		}

		onClick?.();
	};

	const priority = priorityConfig[task.priority];

	const checklistTotal = task.checklist.length;
	const checklistDone = task.checklist.filter((c) => c.done).length;
	const progress =
		checklistTotal > 0
			? Math.round((checklistDone / checklistTotal) * 100)
			: null;

	const isOverdue =
		!task.completed && task.dueDate && new Date(task.dueDate) < new Date();

	const isCompleted = task.completed;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onPointerDown={handlePointerDown}
			className={cn(
				"w-full cursor-grab touch-none rounded-xl border border-outline-variant/20 bg-surface-container-lowest/70 p-lg text-left shadow-sm backdrop-blur-md transition-[transform,box-shadow] duration-200 active:cursor-grabbing",
				!isDragging && "hover:-translate-y-1 hover:shadow-lg",
				isDragging && "opacity-40 shadow-none",
				isCompleted &&
					"opacity-70 grayscale-[0.4] hover:opacity-100 hover:grayscale-0",
			)}
		>
			<div className="flex items-start gap-md">
				<button
					type="button"
					onPointerDown={(e) => e.stopPropagation()}
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
						"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
						task.completed
							? "border-secondary bg-secondary text-on-secondary"
							: "border-outline-variant text-transparent hover:border-primary",
					)}
				>
					<Check className="h-3 w-3" aria-hidden="true" />
				</button>

				<div className="min-w-0 flex-1" onClick={handleContentClick}>
					<div className="mb-sm flex items-center justify-between">
						<span
							className={cn(
								"flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold",
								priority.bg,
								priority.text,
							)}
						>
							<priority.icon
								className="h-3 w-3"
								aria-hidden="true"
							/>
							{priority.label}
						</span>
					</div>

					<h3
						className={cn(
							"mb-xs font-body-md font-bold leading-snug text-on-surface",
							isCompleted &&
								"line-through decoration-on-surface-variant/40",
						)}
					>
						{task.title}
					</h3>

					{task.notes && !isCompleted && (
						<p className="mb-md line-clamp-2 text-xs text-on-surface-variant">
							{task.notes}
						</p>
					)}

					{task.tags.length > 0 && (
						<div className="mb-md flex flex-wrap gap-xs">
							{task.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-surface-container px-2 py-1 text-[10px] font-bold text-on-secondary-container"
								>
									{tag}
								</span>
							))}
						</div>
					)}

					{progress !== null && !isCompleted && (
						<div className="mb-md flex items-center gap-sm">
							<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
								<div
									className="h-full rounded-full bg-primary transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<span className="text-[10px] font-bold text-primary">
								{progress}%
							</span>
						</div>
					)}

					{task.dueDate && (
						<span
							className={cn(
								"flex w-fit items-center gap-1 rounded px-2 py-1 text-[11px] font-medium",
								isOverdue
									? "bg-error-container/40 text-error"
									: "bg-surface-container-low text-on-surface-variant",
							)}
						>
							<CalendarClock
								className="h-3 w-3"
								aria-hidden="true"
							/>
							{format(new Date(task.dueDate), "d MMM", {
								locale: es,
							})}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
