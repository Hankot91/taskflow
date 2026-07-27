import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trash2, Plus } from "lucide-react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
import { useTaskStore } from "@/store/useTaskStore";
import { useModalA11y } from "@/hooks/useModalA11y";
import { ChecklistItemRow } from "@/components/board/ChecklistItemRow";
import type { Task, TaskPriority, ChecklistItem } from "@/types";

const taskFormSchema = z.object({
	title: z
		.string()
		.min(1, "El título es obligatorio")
		.max(120, "Máximo 120 caracteres"),
	notes: z.string().max(500, "Máximo 500 caracteres").optional(),
	priority: z.enum(["high", "medium", "low"]),
	dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskPanelProps {
	open: boolean;
	onClose: () => void;
	task?: Task;
	defaultPriority?: TaskPriority;
	defaultDueDate?: string;
}

export function TaskPanel({
	open,
	onClose,
	task,
	defaultPriority,
	defaultDueDate,
}: TaskPanelProps) {
	const addTask = useTaskStore((s) => s.addTask);
	const updateTask = useTaskStore((s) => s.updateTask);
	const deleteTask = useTaskStore((s) => s.deleteTask);

	const isEditing = Boolean(task);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TaskFormValues>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			title: task?.title ?? "",
			notes: task?.notes ?? "",
			priority: task?.priority ?? defaultPriority ?? "medium",
			dueDate: task?.dueDate ?? defaultDueDate ?? "",
		},
	});

	const [tags, setTags] = useState<string[]>(task?.tags ?? []);
	const [tagInput, setTagInput] = useState("");
	const [checklist, setChecklist] = useState<ChecklistItem[]>(
		task?.checklist ?? [],
	);
	const [checklistInput, setChecklistInput] = useState("");
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const containerRef = useModalA11y<HTMLElement>(open, onClose);

	const addTag = () => {
		const value = tagInput.trim();
		if (value && !tags.includes(value)) setTags((prev) => [...prev, value]);
		setTagInput("");
	};

	const removeTag = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	const addChecklistItem = () => {
		const value = checklistInput.trim();
		if (!value) return;
		setChecklist((prev) => [
			...prev,
			{ id: crypto.randomUUID(), label: value, done: false },
		]);
		setChecklistInput("");
	};

	const toggleChecklistItem = (id: string) => {
		setChecklist((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, done: !item.done } : item,
			),
		);
	};

	const removeChecklistItem = (id: string) => {
		setChecklist((prev) => prev.filter((item) => item.id !== id));
	};

	const checklistSensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const handleChecklistDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setChecklist((prev) => {
			const oldIndex = prev.findIndex((item) => item.id === active.id);
			const newIndex = prev.findIndex((item) => item.id === over.id);
			if (oldIndex === -1 || newIndex === -1) return prev;
			return arrayMove(prev, oldIndex, newIndex);
		});
	};

	const onSubmit = (values: TaskFormValues) => {
		if (isEditing && task) {
			updateTask(task.id, {
				title: values.title,
				notes: values.notes || undefined,
				priority: values.priority,
				dueDate: values.dueDate || undefined,
				tags,
				checklist,
			});
		} else {
			addTask({
				id: crypto.randomUUID(),
				title: values.title,
				notes: values.notes || undefined,
				priority: values.priority,
				dueDate: values.dueDate || undefined,
				createdAt: new Date().toISOString(),
				tags,
				checklist,
				completed: false,
			});
		}
		onClose();
	};

	const handleDelete = () => {
		if (task) {
			deleteTask(task.id);
			onClose();
		}
	};

	if (!open) return null;

	return createPortal(
		<>
			<button
				type="button"
				aria-hidden="true"
				tabIndex={-1}
				onClick={onClose}
				className="fixed inset-0 z-40 bg-on-background/40"
			/>

			<aside
				ref={containerRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby="task-panel-title"
				className="fixed inset-y-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-112 flex-col overflow-hidden rounded-xl bg-surface-container-lowest/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl focus:outline-none"
			>
				{/* Header fijo */}
				<div className="flex shrink-0 items-center justify-between border-b border-outline-variant/30 p-lg">
					<h2
						id="task-panel-title"
						className="text-headline-md font-bold text-on-surface"
					>
						{isEditing ? "Editar tarea" : "Nueva tarea"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
						aria-label="Cerrar panel"
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col overflow-hidden"
				>
					{/* Cuerpo con scroll — TODO el contenido del formulario va aquí adentro */}
					<div className="flex-1 space-y-lg overflow-y-auto p-lg">
						<div>
							<label
								htmlFor="title"
								className="mb-xs block text-label-sm font-medium text-on-surface-variant"
							>
								Título
							</label>
							<input
								id="title"
								type="text"
								{...register("title")}
								className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
								aria-invalid={Boolean(errors.title)}
							/>
							{errors.title && (
								<p className="mt-1 text-xs text-error">
									{errors.title.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="notes"
								className="mb-xs block text-label-sm font-medium text-on-surface-variant"
							>
								Notas
							</label>
							<textarea
								id="notes"
								rows={3}
								{...register("notes")}
								className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
							/>
							{errors.notes && (
								<p className="mt-1 text-xs text-error">
									{errors.notes.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-md">
							<div>
								<label
									htmlFor="priority"
									className="mb-xs block text-label-sm font-medium text-on-surface-variant"
								>
									Prioridad
								</label>
								<select
									id="priority"
									{...register("priority")}
									className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
								>
									<option value="high">Alta</option>
									<option value="medium">Media</option>
									<option value="low">Baja</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="dueDate"
									className="mb-xs block text-label-sm font-medium text-on-surface-variant"
								>
									Fecha límite
								</label>
								<input
									id="dueDate"
									type="date"
									{...register("dueDate")}
									className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
								/>
							</div>
						</div>

						<div>
							<span className="mb-xs block text-label-sm font-medium text-on-surface-variant">
								Etiquetas
							</span>
							<div className="mb-sm flex flex-wrap gap-xs">
								{tags.map((tag) => (
									<span
										key={tag}
										className="flex items-center gap-1 rounded-full bg-surface-container px-2 py-1 text-[11px] font-bold text-on-secondary-container"
									>
										{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											aria-label={`Quitar etiqueta ${tag}`}
											className="hover:text-error"
										>
											<X
												className="h-3 w-3"
												aria-hidden="true"
											/>
										</button>
									</span>
								))}
							</div>
							<div className="flex gap-sm">
								<input
									type="text"
									value={tagInput}
									onChange={(e) =>
										setTagInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addTag();
										}
									}}
									placeholder="Escribe y presiona Enter"
									className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
								/>
								<button
									type="button"
									onClick={addTag}
									className="rounded-lg bg-surface-container-high px-3 py-2 text-on-surface-variant hover:text-primary"
									aria-label="Agregar etiqueta"
								>
									<Plus
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</button>
							</div>
						</div>

						<div>
							<span className="mb-xs block text-label-sm font-medium text-on-surface-variant">
								Checklist
							</span>
							<div className="mb-sm space-y-1">
								<DndContext
									sensors={checklistSensors}
									collisionDetection={closestCenter}
									onDragEnd={handleChecklistDragEnd}
								>
									<SortableContext
										items={checklist.map((item) => item.id)}
										strategy={verticalListSortingStrategy}
									>
										{checklist.map((item) => (
											<ChecklistItemRow
												key={item.id}
												item={item}
												onToggle={toggleChecklistItem}
												onRemove={removeChecklistItem}
											/>
										))}
									</SortableContext>
								</DndContext>
							</div>
							<div className="flex gap-sm">
								<input
									type="text"
									value={checklistInput}
									onChange={(e) =>
										setChecklistInput(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addChecklistItem();
										}
									}}
									placeholder="Agregar ítem y presionar Enter"
									className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
								/>
								<button
									type="button"
									onClick={addChecklistItem}
									className="rounded-lg bg-surface-container-high px-3 py-2 text-on-surface-variant hover:text-primary"
									aria-label="Agregar ítem al checklist"
								>
									<Plus
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</button>
							</div>
						</div>
					</div>
					{/* Fin del cuerpo con scroll */}

					{/* Pie fijo, fuera del área de scroll */}
					<div className="flex shrink-0 items-center gap-sm border-t border-outline-variant/30 p-lg">
						{isEditing && (
							<button
								type="button"
								onClick={() => setConfirmDeleteOpen(true)}
								className="flex items-center gap-sm rounded-lg border border-error/30 px-4 py-2 text-label-sm font-medium text-error hover:bg-error-container/20"
							>
								<Trash2
									className="h-4 w-4"
									aria-hidden="true"
								/>
								Eliminar
							</button>
						)}
						<button
							type="submit"
							className="ml-auto rounded-lg bg-primary px-6 py-2 text-label-sm font-medium text-on-primary shadow-sm hover:bg-primary-container active:scale-95"
						>
							{isEditing ? "Guardar cambios" : "Crear tarea"}
						</button>
					</div>
				</form>
			</aside>

			<ConfirmModal
				open={confirmDeleteOpen}
				title="¿Eliminar esta tarea?"
				description={`"${task?.title ?? ""}" se borrará permanentemente. Esta acción no se puede deshacer.`}
				confirmLabel="Eliminar"
				onConfirm={handleDelete}
				onCancel={() => setConfirmDeleteOpen(false)}
			/>
		</>,
		document.body,
	);
}
