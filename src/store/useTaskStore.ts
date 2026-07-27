import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isBefore, subDays, format } from "date-fns";
import { mockTasks } from "@/data/mockTasks";
import type { Task, TaskPriority } from "@/types";

interface TaskState {
	tasks: Task[];
	completionCounts: Record<string, number>;
	hasHydrated: boolean;
	addTask: (task: Task) => void;
	updateTask: (id: string, patch: Partial<Task>) => void;
	deleteTask: (id: string) => void;
	setPriority: (id: string, priority: TaskPriority) => void;
	toggleCompleted: (id: string) => void;
	pruneOldCompleted: () => void;
	replaceAll: (data: {
		tasks: Task[];
		completionCounts: Record<string, number>;
	}) => void;
}

export const useTaskStore = create<TaskState>()(
	persist(
		(set) => ({
			tasks: mockTasks,
			completionCounts: {},
			hasHydrated: false,
			addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
			updateTask: (id, patch) =>
				set((s) => ({
					tasks: s.tasks.map((t) =>
						t.id === id ? { ...t, ...patch } : t,
					),
				})),
			deleteTask: (id) =>
				set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
			setPriority: (id, priority) =>
				set((s) => ({
					tasks: s.tasks.map((t) =>
						t.id === id ? { ...t, priority } : t,
					),
				})),
			toggleCompleted: (id) =>
				set((s) => {
					const task = s.tasks.find((t) => t.id === id);
					if (!task) return s;
					const willBeCompleted = !task.completed;
					const todayKey = format(new Date(), "yyyy-MM-dd");
					const currentCount = s.completionCounts[todayKey] ?? 0;

					return {
						tasks: s.tasks.map((t) =>
							t.id === id
								? {
										...t,
										completed: willBeCompleted,
										completedAt: willBeCompleted
											? new Date().toISOString()
											: undefined,
									}
								: t,
						),
						completionCounts: {
							...s.completionCounts,
							[todayKey]: Math.max(
								0,
								currentCount + (willBeCompleted ? 1 : -1),
							),
						},
					};
				}),
			pruneOldCompleted: () => {
				const cutoff = subDays(new Date(), 30);
				set((s) => ({
					tasks: s.tasks.filter(
						(t) =>
							!(
								t.completed &&
								t.completedAt &&
								isBefore(new Date(t.completedAt), cutoff)
							),
					),
				}));
			},
			replaceAll: (data) =>
				set({
					tasks: data.tasks,
					completionCounts: data.completionCounts,
				}),
		}),
		{
			name: "taskflow-tasks",
			partialize: (state) => ({
				tasks: state.tasks,
				completionCounts: state.completionCounts,
			}),
			onRehydrateStorage: () => (state) => {
				state?.pruneOldCompleted();
				setTimeout(() => {
					useTaskStore.setState({ hasHydrated: true });
				}, 400);
			},
		},
	),
);
