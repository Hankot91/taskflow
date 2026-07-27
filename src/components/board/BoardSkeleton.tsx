import { Skeleton } from "@/components/ui/Skeleton";

export function BoardSkeleton() {
	return (
		<div className="flex h-full gap-lg overflow-x-hidden pb-md">
			{[0, 1, 2].map((col) => (
				<div key={col} className="flex w-80 shrink-0 flex-col gap-md">
					<Skeleton className="h-6 w-32" />
					{[0, 1].map((card) => (
						<div
							key={card}
							className="space-y-sm rounded-xl bg-surface-container-lowest/70 p-lg"
						>
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			))}
		</div>
	);
}
