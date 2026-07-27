import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Flame, CheckCircle2, CalendarRange, ListChecks } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { StatCard } from "@/components/stats/StatCard";
import { useTaskStore } from "@/store/useTaskStore";
import { StatsSkeleton } from "@/components/stats/StatsSkeleton";

const priorityColors: Record<string, string> = {
	high: "#ba1a1a", // --color-error
	medium: "#006c49", // --color-secondary
	low: "#825100", // --color-tertiary
};

const priorityLabels: Record<string, string> = {
	high: "Alta",
	medium: "Media",
	low: "Baja",
};

function calculateStreak(counts: Record<string, number>): number {
	const today = new Date();
	let cursor = today;

	// Si hoy todavía no completaste nada, damos margen: el día no ha terminado.
	if (!counts[format(today, "yyyy-MM-dd")]) {
		cursor = subDays(today, 1);
	}

	let streak = 0;
	while (counts[format(cursor, "yyyy-MM-dd")] > 0) {
		streak += 1;
		cursor = subDays(cursor, 1);
	}
	return streak;
}

export default function StatsPage() {
	const tasks = useTaskStore((s) => s.tasks);
	const hasHydrated = useTaskStore((s) => s.hasHydrated);
	const completionCounts = useTaskStore((s) => s.completionCounts);

	const totalCompleted = useMemo(
		() => Object.values(completionCounts).reduce((sum, n) => sum + n, 0),
		[completionCounts],
	);

	const streak = useMemo(
		() => calculateStreak(completionCounts),
		[completionCounts],
	);

	const last14Days = useMemo(() => {
		const days = Array.from({ length: 14 }, (_, i) =>
			subDays(new Date(), 13 - i),
		);
		return days.map((day) => {
			const key = format(day, "yyyy-MM-dd");
			return {
				date: format(day, "d MMM", { locale: es }),
				completadas: completionCounts[key] ?? 0,
			};
		});
	}, [completionCounts]);

	const thisWeekCount = useMemo(
		() => last14Days.slice(7).reduce((s, d) => s + d.completadas, 0),
		[last14Days],
	);

	const pendingByPriority = useMemo(() => {
		const pending = tasks.filter((t) => !t.completed);
		return (["high", "medium", "low"] as const)
			.map((p) => ({
				name: priorityLabels[p],
				value: pending.filter((t) => t.priority === p).length,
				color: priorityColors[p],
			}))
			.filter((d) => d.value > 0);
	}, [tasks]);

	const totalPending = tasks.filter((t) => !t.completed).length;

	if (!hasHydrated) return <StatsSkeleton />;
	return (
		<>
			<div className="mb-xl">
				<h1
					className="text-headline-md font-bold text-on-surface"
					style={{ fontFamily: "var(--font-display)" }}
				>
					Estadísticas
				</h1>
				<p className="mt-1 text-body-md text-on-surface-variant">
					Un vistazo a tu progreso, sin ruido.
				</p>
			</div>

			<div className="mb-2xl grid grid-cols-2 gap-md sm:grid-cols-4">
				<StatCard
					label="Racha actual"
					value={`${streak} ${streak === 1 ? "día" : "días"}`}
					icon={Flame}
					tone="text-error"
				/>
				<StatCard
					label="Completadas (total)"
					value={totalCompleted}
					icon={CheckCircle2}
					tone="text-secondary"
				/>
				<StatCard
					label="Esta semana"
					value={thisWeekCount}
					icon={CalendarRange}
					tone="text-primary"
				/>
				<StatCard
					label="Pendientes ahora"
					value={totalPending}
					icon={ListChecks}
					tone="text-on-surface-variant"
				/>
			</div>

			<div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
				<div className="rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md lg:col-span-2">
					<h2 className="mb-lg text-body-lg font-bold text-on-surface">
						Completadas — últimos 14 días
					</h2>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={last14Days}>
								<XAxis
									dataKey="date"
									tick={{
										fontSize: 11,
										fill: "var(--color-on-surface-variant)",
									}}
									axisLine={{
										stroke: "var(--color-outline-variant)",
									}}
									tickLine={false}
									interval={1}
								/>
								<YAxis
									allowDecimals={false}
									tick={{
										fontSize: 11,
										fill: "var(--color-on-surface-variant)",
									}}
									axisLine={false}
									tickLine={false}
									width={24}
								/>
								<Tooltip
									cursor={{
										fill: "var(--color-surface-container-high)",
									}}
									contentStyle={{
										borderRadius: 12,
										border: "1px solid var(--color-outline-variant)",
										background:
											"var(--color-surface-container-lowest)",
										color: "var(--color-on-surface)",
										fontSize: 12,
									}}
									itemStyle={{
										color: "var(--color-on-surface)",
									}}
									labelStyle={{
										color: "var(--color-on-surface-variant)",
									}}
								/>
								<Bar
									dataKey="completadas"
									fill="var(--color-primary)"
									radius={[6, 6, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className="rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md">
					<h2 className="mb-lg text-body-lg font-bold text-on-surface">
						Pendientes por prioridad
					</h2>
					{pendingByPriority.length === 0 ? (
						<p className="flex h-64 items-center justify-center text-center text-xs text-on-surface-variant/60">
							No tienes tareas pendientes 🎉
						</p>
					) : (
						<>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={pendingByPriority}
											dataKey="value"
											nameKey="name"
											innerRadius={50}
											outerRadius={75}
											paddingAngle={3}
										>
											{pendingByPriority.map((entry) => (
												<Cell
													key={entry.name}
													fill={entry.color}
												/>
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												borderRadius: 12,
												border: "1px solid var(--color-outline-variant)",
												background:
													"var(--color-surface-container-lowest)",
												color: "var(--color-on-surface)",
												fontSize: 12,
											}}
											itemStyle={{
												color: "var(--color-on-surface)",
											}}
											labelStyle={{
												color: "var(--color-on-surface-variant)",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-md flex flex-wrap justify-center gap-md">
								{pendingByPriority.map((entry) => (
									<span
										key={entry.name}
										className="flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant"
									>
										<span
											className="h-2 w-2 rounded-full"
											style={{ background: entry.color }}
										/>
										{entry.name} ({entry.value})
									</span>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
