import { Skeleton } from "@/components/ui/Skeleton";

export function StatsSkeleton() {
	return (
		<div>
			<Skeleton className="mb-2 h-8 w-40" />
			<Skeleton className="mb-xl h-4 w-56" />

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

			<div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
				<Skeleton className="h-80 rounded-xl lg:col-span-2" />
				<Skeleton className="h-80 rounded-xl" />
			</div>
		</div>
	);
}
