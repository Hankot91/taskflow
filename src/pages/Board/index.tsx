import { useState } from "react";
import { Plus } from "lucide-react";
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	useSensor,
	useSensors,
	closestCenter,
	type DragEndEvent,
	type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "@/components/board/KanbanColumn";
import { TaskCard } from "@/components/board/TaskCard";
import { TaskPanel } from "@/components/board/TaskPanel";
import { useTaskStore } from "@/store/useTaskStore";
import { BoardSkeleton } from "@/components/board/BoardSkeleton";
import { useUIStore } from "@/store/useUIStore";
import { taskMatchesQuery } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types";
import { isToday } from "date-fns";

const columns: { priority: TaskPriority; label: string }[] = [
	{ priority: "high", label: "Alta prioridad" },
	{ priority: "medium", label: "Media prioridad" },
	{ priority: "low", label: "Baja prioridad" },
];

const priorities: TaskPriority[] = ["high", "medium", "low"];

export default function BoardPage() {
	const tasks = useTaskStore((s) => s.tasks);
	const hasHydrated = useTaskStore((s) => s.hasHydrated);
	const setPriority = useTaskStore((s) => s.setPriority);
	const searchQuery = useUIStore((s) => s.searchQuery);

	const [panelOpen, setPanelOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
	const [defaultPriority, setDefaultPriority] = useState<
		TaskPriority | undefined
	>(undefined);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const openCreate = (priority?: TaskPriority) => {
		setEditingTask(undefined);
		setDefaultPriority(priority);
		setPanelOpen(true);
	};

	const openEdit = (task: Task) => {
		setEditingTask(task);
		setDefaultPriority(undefined);
		setPanelOpen(true);
	};

	const handleDragStart = (event: DragStartEvent) => {
		const task = tasks.find((t) => t.id === event.active.id);
		setActiveTask(task ?? null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveTask(null);
		const { active, over } = event;
		if (!over) return;

		const draggedTask = tasks.find((t) => t.id === active.id);
		if (!draggedTask) return;

		const overIsColumn = priorities.includes(over.id as TaskPriority);
		const targetPriority = overIsColumn
			? (over.id as TaskPriority)
			: tasks.find((t) => t.id === over.id)?.priority;

		if (targetPriority && targetPriority !== draggedTask.priority) {
			setPriority(draggedTask.id, targetPriority);
		}
	};
	
	if (!hasHydrated) return <BoardSkeleton />;
	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div className="flex h-full gap-lg overflow-x-auto pb-md">
					{columns.map((col) => (
						<KanbanColumn
							key={col.priority}
							title={col.label}
							priority={col.priority}
							tasks={tasks
								.filter(
									(t) =>
										t.priority === col.priority &&
										(!t.completed ||
											(t.completedAt &&
												isToday(
													new Date(t.completedAt),
												))) &&
										taskMatchesQuery(t, searchQuery),
								)
								.sort(
									(a, b) =>
										Number(a.completed) -
										Number(b.completed),
								)}
							onAddTask={() => openCreate(col.priority)}
							onTaskClick={openEdit}
						/>
					))}
				</div>

				<DragOverlay>
					{activeTask ? <TaskCard task={activeTask} /> : null}
				</DragOverlay>
			</DndContext>

			<button
				type="button"
				onClick={() => openCreate()}
				className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-all hover:scale-110 active:scale-95"
				aria-label="Crear nueva tarea"
			>
				<Plus className="h-7 w-7" aria-hidden="true" />
			</button>

			<TaskPanel
				key={panelOpen ? (editingTask?.id ?? "new") : "closed"}
				open={panelOpen}
				onClose={() => setPanelOpen(false)}
				task={editingTask}
				defaultPriority={defaultPriority}
			/>
		</>
	);
}
