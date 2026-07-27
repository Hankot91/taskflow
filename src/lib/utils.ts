import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Task } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function taskMatchesQuery(task: Task, query: string): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;

	return (
		task.title.toLowerCase().includes(q) ||
		(task.notes?.toLowerCase().includes(q) ?? false) ||
		task.tags.some((tag) => tag.toLowerCase().includes(q))
	);
}
