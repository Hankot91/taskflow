import { Skeleton } from "@/components/ui/Skeleton";

export function TodaySkeleton() {
	return (
		<div>
			<Skeleton className="mb-2 h-8 w-48" />
			<Skeleton className="mb-xl h-4 w-40" />

			<div className="mb-2xl grid grid-cols-2 gap-md sm:grid-cols-4">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className="rounded-xl bg-surface-container-lowest/70 p-lg"
					>
						<Skeleton className="mb-sm h-5 w-5" />
						<Skeleton className="mb-1 h-8 w-10" />
						<Skeleton className="h-3 w-16" />
					</div>
				))}
			</div>

			<Skeleton className="mb-md h-5 w-24" />
			<div className="space-y-sm">
				{[0, 1, 2].map((i) => (
					<Skeleton key={i} className="h-14 w-full rounded-xl" />
				))}
			</div>
		</div>
	);
}
