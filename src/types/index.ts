export type TaskPriority = "high" | "medium" | "low";

export interface ChecklistItem {
	id: string;
	label: string;
	done: boolean;
}

export interface Task {
	id: string;
	title: string;
	notes?: string;
	priority: TaskPriority;
	dueDate?: string;
	createdAt: string;
	tags: string[];
	checklist: ChecklistItem[];
	completed: boolean;
	completedAt?: string;
}

export type TaskNotificationType = "overdue" | "due-today" | "due-soon";

export interface TaskNotification {
	taskId: string;
	type: TaskNotificationType;
	message: string;
}
