import { z } from "zod";

const checklistItemSchema = z.object({
	id: z.string(),
	label: z.string(),
	done: z.boolean(),
});

const taskSchema = z.object({
	id: z.string(),
	title: z.string(),
	notes: z.string().optional(),
	priority: z.enum(["high", "medium", "low"]),
	dueDate: z.string().optional(),
	createdAt: z.string(),
	tags: z.array(z.string()),
	checklist: z.array(checklistItemSchema),
	completed: z.boolean(),
	completedAt: z.string().optional(),
});

export const importFileSchema = z.object({
	tasks: z.array(taskSchema),
	completionCounts: z.record(z.string(), z.number()),
});

export type ImportFileData = z.infer<typeof importFileSchema>;
