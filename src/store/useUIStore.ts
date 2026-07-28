import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface UIState {
	isSidebarOpen: boolean;
	isCollapsed: boolean;
	searchQuery: string;
	theme: Theme;
	notificationsEnabled: boolean;
	toggleSidebar: () => void;
	setSidebarOpen: (open: boolean) => void;
	toggleCollapsed: () => void;
	setSearchQuery: (query: string) => void;
	setTheme: (theme: Theme) => void;
	setNotificationsEnabled: (enabled: boolean) => void;
}

function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
	document.documentElement.style.colorScheme = theme;
}

export const useUIStore = create<UIState>()(
	persist(
		(set) => ({
			isSidebarOpen: false,
			isCollapsed: false,
			searchQuery: "",
			theme: "light",
			notificationsEnabled: true,
			toggleSidebar: () =>
				set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
			setSidebarOpen: (open) => set({ isSidebarOpen: open }),
			toggleCollapsed: () =>
				set((s) => ({ isCollapsed: !s.isCollapsed })),
			setSearchQuery: (query) => set({ searchQuery: query }),
			setTheme: (theme) => {
				applyTheme(theme);
				set({ theme });
			},
			setNotificationsEnabled: (enabled) =>
				set({ notificationsEnabled: enabled }),
		}),
		{
			name: "taskflow-ui-preferences",
			partialize: (s) => ({
				theme: s.theme,
				notificationsEnabled: s.notificationsEnabled,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) applyTheme(state.theme);
			},
		},
	),
);
