import { GripVertical, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types";

interface ChecklistItemRowProps {
	item: ChecklistItem;
	onToggle: (id: string) => void;
	onRemove: (id: string) => void;
}

export function ChecklistItemRow({
	item,
	onToggle,
	onRemove,
}: ChecklistItemRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"flex items-center gap-sm rounded-lg bg-surface-container-low px-3 py-2",
				isDragging && "opacity-40",
			)}
		>
			<div
				{...attributes}
				{...listeners}
				className="cursor-grab touch-none text-on-surface-variant/40 hover:text-on-surface-variant active:cursor-grabbing"
			>
				<GripVertical className="h-4 w-4 shrink-0" aria-hidden="true" />
			</div>

			<button
				type="button"
				onClick={() => onToggle(item.id)}
				aria-pressed={item.done}
				aria-label={
					item.done ? "Marcar como pendiente" : "Marcar como hecho"
				}
				className={cn(
					"flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 text-[10px]",
					item.done
						? "border-secondary bg-secondary text-on-secondary"
						: "border-outline-variant text-transparent",
				)}
			>
				✓
			</button>

			<span
				className={cn(
					"flex-1 text-body-md text-on-surface",
					item.done && "text-on-surface-variant/50 line-through",
				)}
			>
				{item.label}
			</span>

			<button
				type="button"
				onClick={() => onRemove(item.id)}   
				aria-label="Eliminar ítem"
				className="text-on-surface-variant/50 hover:text-error"
			>
				<X className="h-3.5 w-3.5" aria-hidden="true" />
			</button>
		</div>
	);
}
