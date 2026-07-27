import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { navItems } from "@/lib/nav";
import { useUIStore } from "@/store/useUIStore";

export function Header() {
	const setMobileOpen = useUIStore((s) => s.setSidebarOpen);
	const searchQuery = useUIStore((s) => s.searchQuery);
	const setSearchQuery = useUIStore((s) => s.setSearchQuery);
	const { pathname } = useLocation();
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const currentPage =
		navItems.find((item) =>
			item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
		)?.label ?? "TaskFlow";

	return (
		<header className="flex h-16 shrink-0 items-center gap-md rounded-xl bg-surface-container-lowest/80 px-md shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
			{/* Grupo izquierdo: menú + título — oculto en mobile mientras el buscador está abierto */}
			{!isSearchOpen && (
				<div className="flex flex-1 items-center gap-md">
					<button
						type="button"
						onClick={() => setMobileOpen(true)}
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary lg:hidden"
						aria-label="Abrir menú de navegación"
					>
						<Menu className="h-5 w-5" aria-hidden="true" />
					</button>

					<h1 className="font-headline-md text-[18px] font-bold text-on-surface">
						{currentPage}
					</h1>
				</div>
			)}

			{/* Trigger de búsqueda: solo mobile, solo cuando está cerrada */}
			{!isSearchOpen && (
				<button
					type="button"
					onClick={() => setIsSearchOpen(true)}
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary sm:hidden"
					aria-label="Buscar tareas"
				>
					<Search className="h-5 w-5" aria-hidden="true" />
				</button>
			)}

			{/* Buscador de escritorio: siempre visible*/}
			<label className="relative hidden w-80 shrink-0 sm:block">
				<span className="sr-only">Buscar tareas</span>
				<Search
					className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
					aria-hidden="true"
				/>
				<input
					type="text"
					role="searchbox"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Buscar tareas..."
					className="h-9 w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-low pl-9 pr-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
				/>
			</label>

			{/* Buscador expandido: solo mobile, solo cuando está abierto */}
			{isSearchOpen && (
				<div className="flex flex-1 items-center gap-sm sm:hidden">
					<label className="relative flex-1">
						<span className="sr-only">Buscar tareas</span>
						<Search
							className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
							aria-hidden="true"
						/>
						<input
							type="text"
							role="searchbox"
							autoFocus
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar tareas..."
							className="h-9 w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-low pl-9 pr-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
						/>
					</label>
					<button
						type="button"
						onClick={() => {
							setIsSearchOpen(false);
							setSearchQuery("");
						}}
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
						aria-label="Cerrar búsqueda"
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			)}
		</header>
	);
}
