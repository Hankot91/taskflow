import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function MainLayout() {
	return (
		<div className="flex h-screen gap-4 overflow-hidden bg-background p-4">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-label-sm focus:text-on-primary"
			>
				Saltar al contenido principal
			</a>

			<Sidebar />

			<div className="flex min-w-0 flex-1 flex-col gap-4">
				<Header />
				<main
					id="main-content"
					tabIndex={-1}
					className="flex-1 overflow-y-auto rounded-xl p-lg"
				>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
