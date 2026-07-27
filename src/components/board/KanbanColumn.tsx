import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "@/components/board/TaskCard";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types";

interface KanbanColumnProps {
	title: string;
	priority: TaskPriority;
	tasks: Task[];
	onAddTask?: () => void;
	onTaskClick?: (task: Task) => void;
}

export function KanbanColumn({
	title,
	priority,
	tasks,
	onAddTask,
	onTaskClick,
}: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({ id: priority });

	return (
		<div className="flex h-full w-80 shrink-0 flex-col">
			<div className="mb-lg flex items-center justify-between px-xs">
				<div className="flex items-center gap-sm">
					<h2 className="text-body-lg font-bold text-on-surface">
						{title}
					</h2>
					<span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-[11px] font-bold text-on-surface-variant">
						{tasks.length}
					</span>
				</div>
				<button
					type="button"
					onClick={onAddTask}
					className="rounded-md p-1 text-on-surface-variant transition-colors hover:text-primary"
					aria-label={`Agregar tarea en ${title}`}
				>
					<Plus className="h-4 w-4" aria-hidden="true" />
				</button>
			</div>

			<div
				ref={setNodeRef}
				className={cn(
					"flex-1 space-y-md overflow-y-auto rounded-xl pb-xl pr-xs transition-colors",
					isOver && "bg-primary-container/10 ring-2 ring-primary/30",
				)}
			>
				<SortableContext
					items={tasks.map((t) => t.id)}
					strategy={verticalListSortingStrategy}
				>
					{tasks.length === 0 ? (
						<p className="rounded-xl border border-dashed border-outline-variant/40 p-lg text-center text-xs text-on-surface-variant/60">
							Sin tareas
						</p>
					) : (
						tasks.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								onClick={() => onTaskClick?.(task)}
							/>
						))
					)}
				</SortableContext>
			</div>
		</div>
	);
}
