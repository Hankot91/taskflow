import {
	Home,
	KanbanSquare,
	CalendarDays,
	BarChart3,
	Settings,
	type LucideIcon,
} from "lucide-react";

export interface NavItem {
	label: string;
	to: string;
	icon: LucideIcon;
}

export const navItems: NavItem[] = [
	{ label: "Hoy", to: "/", icon: Home },
	{ label: "Tablero", to: "/board", icon: KanbanSquare },
	{ label: "Calendario", to: "/calendar", icon: CalendarDays },
	{ label: "Estadísticas", to: "/stats", icon: BarChart3 },
	{ label: "Configuración", to: "/settings", icon: Settings },
];
