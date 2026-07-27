import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: LucideIcon;
	tone?: string;
}

export function StatCard({
	label,
	value,
	icon: Icon,
	tone = "text-primary",
}: StatCardProps) {
	return (
		<div className="rounded-xl bg-surface-container-lowest/70 p-lg shadow-sm ring-1 ring-black/5 backdrop-blur-md">
			<Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
			<p className="mt-sm text-display-lg-mobile font-bold text-on-surface">
				{value}
			</p>
			<p className="text-label-sm text-on-surface-variant">{label}</p>
		</div>
	);
}
