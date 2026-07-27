import { Skeleton } from "@/components/ui/Skeleton";

export function CalendarSkeleton() {
	return (
		<div>
			<div className="mb-lg flex items-center justify-between">
				<Skeleton className="h-8 w-40" />
				<Skeleton className="h-8 w-32" />
			</div>
			<div className="grid grid-cols-7 gap-2">
				{Array.from({ length: 35 }).map((_, i) => (
					<Skeleton key={i} className="min-h-37.5 rounded-xl" />
				))}
			</div>
		</div>
	);
}
