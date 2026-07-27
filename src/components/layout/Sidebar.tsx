import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	LayoutGrid,
	HelpCircle,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { navItems } from "@/lib/nav";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import { HelpModal } from "@/components/layout/HelpModal";

export function Sidebar() {
	const isCollapsed = useUIStore((s) => s.isCollapsed);
	const toggleCollapsed = useUIStore((s) => s.toggleCollapsed);
	const isMobileOpen = useUIStore((s) => s.isSidebarOpen);
	const setMobileOpen = useUIStore((s) => s.setSidebarOpen);
	const [helpOpen, setHelpOpen] = useState(false);

	return (
		<>
			{isMobileOpen && (
				<button
					type="button"
					aria-hidden="true"
					tabIndex={-1}
					onClick={() => setMobileOpen(false)}
					className="fixed inset-0 z-30 bg-on-background/40 lg:hidden"
				/>
			)}

			<aside
				aria-label="Navegación principal"
				className={cn(
					"fixed inset-y-4 left-4 z-40 flex flex-col rounded-xl bg-surface-container-lowest/80 py-lg shadow-sm ring-1 ring-black/5 backdrop-blur-xl transition-all duration-200 lg:static lg:inset-auto",
					isCollapsed ? "w-20 items-center" : "w-64 px-md",
					isMobileOpen
						? "translate-x-0"
						: "-translate-x-[calc(100%+1rem)] lg:translate-x-0",
				)}
			>
				{/* Brand header */}
				<div
					className={cn(
						"flex shrink-0 items-center pb-xl",
						isCollapsed ? "flex-col gap-sm px-0" : "gap-md px-sm",
					)}
				>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
						<LayoutGrid className="h-5 w-5" aria-hidden="true" />
					</div>

					{!isCollapsed && (
						<span className="font-headline-md text-headline-md font-bold text-on-surface">
							TaskFlow
						</span>
					)}

					<button
						type="button"
						onClick={toggleCollapsed}
						className={cn(
							"hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary lg:flex",
							!isCollapsed && "ml-auto",
						)}
						aria-label={
							isCollapsed ? "Expandir menú" : "Colapsar menú"
						}
					>
						{isCollapsed ? (
							<ChevronsRight
								className="h-3.5 w-3.5"
								aria-hidden="true"
							/>
						) : (
							<ChevronsLeft
								className="h-3.5 w-3.5"
								aria-hidden="true"
							/>
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav
					className={cn(
						"flex-1 space-y-1",
						isCollapsed && "flex w-full flex-col items-center",
					)}
					aria-label="Secciones"
				>
					{navItems.map((item) => (
						<div key={item.to} className="group relative w-full">
							<NavLink
								to={item.to}
								end={item.to === "/"}
								onClick={() => setMobileOpen(false)}
								className={({ isActive }) =>
									cn(
										"flex items-center gap-md rounded-lg py-2.5 text-body-md transition-all duration-200",
										isCollapsed
											? "h-12 w-auto justify-center"
											: "px-sm",
										isActive
											? "border-r-2 border-primary bg-primary-container/10 font-bold text-primary"
											: "text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
									)
								}
							>
								<item.icon
									className="h-5 w-5 shrink-0"
									aria-hidden="true"
								/>
								{!isCollapsed && <span>{item.label}</span>}
							</NavLink>

							{isCollapsed && (
								<span
									role="tooltip"
									className="pointer-events-none absolute left-16 top-2 z-50 -translate-x-2 whitespace-nowrap rounded-md bg-inverse-surface px-sm py-xs text-[12px] text-inverse-on-surface opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
								>
									{item.label}
								</span>
							)}
						</div>
					))}
				</nav>

				{/* Footer: solo Ayuda */}
				<div
					className={cn(
						"mt-auto shrink-0 border-t border-outline-variant/30 pt-lg",
						isCollapsed && "flex w-full flex-col items-center",
					)}
				>
					<button
						type="button"
						onClick={() => setHelpOpen(true)}
						className={cn(
							"flex items-center gap-md rounded-lg py-2.5 text-body-md text-on-surface-variant transition-all duration-200 hover:bg-surface-container-high hover:text-primary",
							isCollapsed
								? "h-12 w-12 justify-center"
								: "w-full px-sm",
						)}
					>
						<HelpCircle
							className="h-5 w-5 shrink-0"
							aria-hidden="true"
						/>
						{!isCollapsed && "Ayuda"}
					</button>
				</div>
			</aside>

			<HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
		</>
	);
}
